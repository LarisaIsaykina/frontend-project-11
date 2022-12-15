import * as yup from 'yup';

export default (viewer, value) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'existing',
    },
    string: {
      url: 'invalid',
    },
  });

  const existingReferences = viewer.validatedUrls;
  const schema = yup.string().url().notOneOf(existingReferences);
  return schema.validate(value);
};
