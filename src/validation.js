import * as yup from 'yup';

export default (viewer, value) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'existingRssError',
    },
    string: {
      url: 'invalidRssError',
    },
  });

  const existingReferences = viewer.validatedUrls;
  const schema = yup.string().url().notOneOf(existingReferences);
  return schema.validate(value);
};
