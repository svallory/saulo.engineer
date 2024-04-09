# Marko JSON Schemas

## Contributing

## Updating the schemas

Schemas are written in Yaml under `src/` and then converted to json.

To edit the schemas and immediately test the changes, do the following:

1. Run `pnpm run dev`
2. Open the schema you want to edit
3. Open an example file from `tests/local/`
4. Edit & save the Yaml schema file
5. Trigger the autocomplete for the thing you want to check

## Validating the schemas

Most of the time you'll be able to see issues in vscode. But that's not always the case.

Before making a PR, be sure to run the `validate-examples` script

> Note: this is NOT perfect. Proper tests will eventually be written
> to ensure nothing breaks when updates are made to the schemas.

### Requirements to Run Validation

The validator is written in python and I recommend you install Python `>= 3.11`.

After python is set up, do the following:

1. Install `pipx`

    On a mac:

    ```shell
    brew install pipx
    pipx ensurepath

    # If you want to allow
    # pipx actions with --global argument:
    sudo pipx ensurepath --global
    ```

    Check [`pipx` docs](https://github.com/pypa/pipx?tab=readme-ov-file) for other systems.

    Enabling autocompletions for zsh:

    ```shell
    pipx install argcomplete
    # run the command below and follow the instructions
    pipx completions
    ```

2. Install `check-jsonschema`

    ```shell
    pipx install check-jsonschema
    ```

3. Validate the schemas

    From the repository root, run:

    ```shell
    ./validate-schemas.sh
    ```
