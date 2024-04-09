# Marko JSON Schemas

## Contributing

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
