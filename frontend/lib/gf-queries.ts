/** GraphQL documents for WPGraphQL for Gravity Forms (AxeWP). */

export const GET_GF_FORM = `
query GetGfForm($id: ID!) {
  gfForm(id: $id, idType: DATABASE_ID) {
    databaseId
    title
    submitButton {
      text
      type
      imageUrl
    }
    formFields(first: 100) {
      nodes {
        databaseId
        type
        ... on TextField {
          label
          isRequired
          placeholder
          cssClass
        }
        ... on EmailField {
          label
          isRequired
          cssClass
        }
        ... on PhoneField {
          label
          isRequired
          cssClass
        }
        ... on TextAreaField {
          label
          isRequired
          placeholder
          cssClass
        }
        ... on SelectField {
          label
          isRequired
          cssClass
          choices {
            text
            value
          }
        }
        ... on CheckboxField {
          label
          isRequired
          cssClass
          inputs {
            id
            label
          }
          choices {
            text
            value
          }
        }
        ... on RadioField {
          label
          isRequired
          cssClass
          choices {
            text
            value
          }
        }
        ... on NameField {
          label
          isRequired
          cssClass
          inputs {
            id
            label
          }
        }
        ... on AddressField {
          label
          isRequired
        }
        ... on CaptchaField {
          label
          captchaType
        }
        ... on ConsentField {
          label
          checkboxLabel
        }    
        ... on SectionField {
          description
        }
      }
    }
  }
}
`;

export const SUBMIT_GF_FORM = `
mutation SubmitGfForm($id: ID!, $values: [FormFieldValuesInput!]!) {
  submitGfForm(input: { id: $id, fieldValues: $values }) {
    confirmation {
      type
      message
      url
    }
    errors {
      id
      message
    }
    entry {
      ... on GfSubmittedEntry {
        databaseId
      }
    }
  }
}
`;
