/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Helper to handle array forms

***********************************
*/
import { computed } from "vue";
import { helpers } from "@vuelidate/validators";

export default function forEach(validators, forceSimple = false) {
  return {
    $validator(collection, ...others) {
      return helpers.unwrap(collection).reduce(
        (previous, collectionItem, index) => {
          if (!forceSimple && typeof collectionItem === "object") {
            const collectionEntryResult = objectForEach(
              collectionItem,
              index,
              validators,
              others
            );
            return {
              $valid: previous.$valid && collectionEntryResult.$valid,
              $data: previous.$data.concat(collectionEntryResult.$data),
              $errors: previous.$errors.concat(collectionEntryResult.$errors),
            };
          }
          const propertyResult = primitiveForEach(
            collectionItem,
            index,
            validators,
            others
          );
          return {
            $valid: previous.$valid && propertyResult.$valid,
            $data: previous.$data.concat(propertyResult.$data),
            $errors: previous.$errors.concat(propertyResult.$errors),
          };
        },
        { $valid: true, $data: [], $errors: [] }
      );
    },
    $message: ({ $response }) => {
      if (!$response) return [];
      return $response.$errors.map((context) => {
        if (context.$model) return context.$message;
        return Object.values(context)
          .map((errors) =>
            Array.isArray(errors)
              ? errors.map((e) => e.$message)
              : errors.$message
          )
          .reduce((a, b) => a.concat(b), []);
      });
    },
    $params: computed(() => {
      return Object.entries(validators).reduce((map, [key, value]) => {
        map[key] = { ...value.$params };
        return map;
      }, {});
    }),
  };
}

function primitiveForEach($model, index, validators, others) {
  const innerValidators = validators || {};
  return Object.entries(innerValidators).reduce(
    (all, [validatorName, currentValidator]) => {
      const validatorFunction =
        helpers.unwrapNormalizedValidator(currentValidator);
      const $response = validatorFunction.call(this, $model, index, ...others);
      const $valid = helpers.unwrapValidatorResponse($response);
      all.$data[validatorName] = $response;
      all.$data.$invalid = !$valid || !!all.$data.$invalid;
      all.$data.$error = all.$data.$invalid;
      if (!$valid) {
        let $message = currentValidator.$message || "";
        const $params = currentValidator.$params || {};
        if (typeof $message === "function") {
          $message = $message({
            $pending: false,
            $invalid: !$valid,
            $params,
            $model,
            $response,
          });
        }
        all.$errors.push({
          $message,
          $params,
          $response,
          $model,
          $pending: false,
          $validator: validatorName,
        });
      }
      return {
        $valid: all.$valid && $valid,
        $data: all.$data,
        $errors: all.$errors,
      };
    },
    { $valid: true, $data: {}, $errors: [] }
  );
}

function objectForEach(collectionItem, index, validators, others) {
  return Object.entries(collectionItem).reduce(
    (all, [property, $model]) => {
      const innerValidators = validators[property] || {};
      const propertyResult = Object.entries(innerValidators).reduce(
        // eslint-disable-next-line no-shadow
        (all, [validatorName, currentValidator]) => {
          const validatorFunction =
            helpers.unwrapNormalizedValidator(currentValidator);
          const $response = validatorFunction.call(
            this,
            $model,
            collectionItem,
            index,
            ...others
          );
          const $valid = helpers.unwrapValidatorResponse($response);
          all.$data[validatorName] = $response;
          all.$data.$invalid = !$valid || !!all.$data.$invalid;
          all.$data.$error = all.$data.$invalid;
          if (!$valid) {
            let $message = currentValidator.$message || "";
            const $params = currentValidator.$params || {};
            if (typeof $message === "function") {
              $message = $message({
                $pending: false,
                $invalid: !$valid,
                $params,
                $model,
                $response,
              });
            }
            all.$errors.push({
              $property: property,
              $message,
              $params,
              $response,
              $model,
              $pending: false,
              $validator: validatorName,
            });
          }
          return {
            $valid: all.$valid && $valid,
            $data: all.$data,
            $errors: all.$errors,
          };
        },
        { $valid: true, $data: {}, $errors: [] }
      );
      all.$data[property] = propertyResult.$data;
      all.$errors[property] = propertyResult.$errors;
      return {
        $valid: all.$valid && propertyResult.$valid,
        $data: all.$data,
        $errors: all.$errors,
      };
    },
    { $valid: true, $data: {}, $errors: {} }
  );
}
