# Contributing to ship18ion

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions.

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](README.md).

Before you ask a question, it is best to search for existing [Issues](/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

## I Want To Contribute

### Reporting Bugs

- Make sure that you are using the latest version.
- Read the documentation carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a search to see if the problem has already been reported. If it has, add a comment to the existing issue instead of opening a new one.

### Suggesting Enhancements

- Open a new issue and use the **Feature Request** template.
- Explain why this enhancement would be useful to most users.

## Styleguides

### Commit Messages

- Use [Conventional Commits](https://www.conventionalcommits.org/).

### Code Style

- Keep code clean and use the existing ESLint/Prettier configs (if available).
- Add tests for new features.

## Development Workflow

To test your changes locally on another project without publishing:

1.  **Build and Link**:
    ```bash
    npm run build
    npm link
    ```
2.  **Use in Target Project**:
    ```bash
    npm link ship18ion
    npx ship18ion
    ```

Thank you!
