export const textCaseConverterKnowledge = {
  introduction:
    "A Text Case & Naming Converter helps developers and writers instantly transform text into standard programming naming conventions, ensuring consistency and readability across codebases.",
  
  sections: [
    {
      title: "Why Naming Conventions Matter",
      content:
        "Consistent naming is a cornerstone of readable and maintainable code. Different languages and frameworks have established conventions (e.g., JavaScript favors camelCase for variables, while Python prefers snake_case). This tool bridges those gaps instantly.",
    },
    {
      title: "camelCase vs PascalCase",
      content:
        "Both formats capitalize the first letter of each word except the first. camelCase starts with a lowercase letter (e.g., myVariableName) and is standard for JavaScript variables and functions. PascalCase starts with an uppercase letter (e.g., MyClassName) and is typically used for classes, components, and constructors.",
    },
    {
      title: "snake_case vs kebab-case",
      content:
        "snake_case uses underscores to separate words (e.g., my_variable_name) and is widely used in Python, Ruby, and database column names. kebab-case uses hyphens (e.g., my-variable-name) and is the standard for CSS classes, URL slugs, and HTML attributes.",
    },
    {
      title: "UPPER_SNAKE_CASE",
      content:
        "Also known as MACRO_CASE, this format is universally used for constants, environment variables, and configuration values (e.g., MAX_RETRIES, API_BASE_URL) to clearly signal that the value should not be modified.",
    },
    {
      title: "How Our Tokenization Works",
      content:
        "This utility uses a canonical tokenization model. It intelligently splits your input at word boundaries, camelCase transitions, acronyms (like 'API' or 'XML'), and numbers. Special characters and punctuation are stripped to ensure the output remains a valid identifier.",
    },
    {
      title: "Privacy & Processing",
      content:
        "All text transformation happens entirely within your browser using native JavaScript string manipulation. Your input is never sent to any server, logged, or stored.",
    },
  ],
};