export type PropertiesOf<T> = {
  [key in keyof T]: { type: string; description: string };
};

export type JsonDefinitionOf<T> = {
  type?: string;
  additionalProperties?: boolean;
  properties?: PropertiesOf<T>;
};

/**
 * Represents a Marko tag name enclosed in angle brackets.
 * Used to define custom Marko tags within a taglib definition.
 */
export type TagShorthand = `<${string}>`;

/**
 * Represents a shorthand for defining repeated tag within a Marko tag.
 */
export type RepeatedTag = `${TagShorthand}[]`;

/**
 * Represents a Marko attribute name prefixed with "@".
 * Used for defining attributes of a Marko tag in a taglib definition.
 */
export type AttributeShorthand = `@${string}`;

/**
 * Represents a shorthand for defining a mapping of an attribute tag
 * to an attribute with a different name
 */
export type TagMapping = `${AttributeShorthand} ${TagShorthand}`;

/**
 * Represents a shorthand for defining repeated nested tags within a Marko tag.
 * The syntax includes a target property for the nested tag collection,
 * indicated by prefixing with "@" and appending "[]" to denote repetition.
 */
export type RepeatedTagMapping = `${TagMapping}[]`;

export type TagDefinitionShortHands = {
  [key: TagShorthand]: TagDefinition;

  [key: RepeatedTag]: TagDefinition;

  [key: TagMapping]: TagDefinition;

  [key: RepeatedTagMapping]: TagDefinition;
};

export type AttributeShorthands = {
  [key: AttributeShorthand]: AttributeDefinition;
};

/**
 * Defines the structure and content for autocomplete suggestions within Marko tooling,
 * aiming to improve developer experience by providing context-aware code completion,
 * hints, and documentation links.
 */
export type Autocomplete = {
  /** A brief description of the autocomplete suggestion. */
  description: string;

  /** A URL pointing to more detailed documentation for this suggestion. */
  descriptionMoreURL?: string;

  /** The text displayed in the autocomplete dropdown. */
  displayText?: string;

  /** A code snippet associated with the suggestion, facilitating quick insertion. */
  snippet?: string;
};

export type AttributeType =
  | "expression"
  | "string"
  | "number"
  | "boolean"
  | "regexp"
  | "date"
  | "object"
  | "array"
  | "function";

/**
 * Describes the expected structure and validation rules for a tag attribute,
 * including its type, default values, and additional metadata for enhancing tooling support and runtime validation.
 */
export type AttributeDefinition =
  | AttributeType
  | {
      /** Provides autocomplete suggestions for the attribute value. */
      autocomplete?: Autocomplete[];

      /** Provides a default value for the attribute when not explicitly set. */
      defaultValue?: any;

      /**
       * Marks the attribute as deprecated.
       * Only used by tooling.
       */
      deprecated?: boolean;

      /**
       * Describes the attribute's purpose or usage,
       * mainly for documentation purposes.
       * Only used by tooling.
       */
      description?: string;

      /**
       * By default component attributes are camelCased; this disables that feature.
       * @default false
       */
      preserveName?: boolean;

      /**
       * Indicates to Marko that the attribute name is a pattern (e.g. data-*)
       */
      pattern?: boolean;

      /**
       * By default native tag attributes are dash-cased; this disables that feature.
       * @default false
       */
      removeDashes?: boolean;

      /**
       * Indicates whether the attribute is required for the tag's functionality.
       */
      required?: boolean;

      /**
       * Specifies the data type of the attribute (e.g., string, number).
       */
      type?: AttributeType;
    };

/**
 * Captures the comprehensive configuration of a Marko tag, including its attributes,
 * nested tags, and special properties that influence parsing, rendering, and
 * documentation generation.
 */
export type TagDefinition = TagDefinitionShortHands &
  AttributeShorthands & {
    /**
     * Defines the attributes that the tag supports.
     * Attributes can be predefined with types, default values, and other options.
     */
    attributes?: Record<string, AttributeDefinition>;

    /**
     * Provides autocomplete suggestions for the tag, enhancing developer experience
     * by offering context-aware code completion within editors.
     */
    autocomplete?: Autocomplete[];

    /**
     * Flags the tag as deprecated, indicating it should be avoided in new development. */
    deprecated?: boolean;

    /**
     * Provides a brief description of the tag's purpose, used in documentation
     * and tooltips.
     */
    description?: string;

    /**
     * A list of feature flags that enable experimental or optional features for this tag.
     */
    featureFlags?: string[];

    /** Indicates whether the tag is considered to be standard HTML. */
    html?: boolean;

    /**
     * Specifies the type of HTML tag, e.g., "svg" or "html", to enable specific parsing and rendering optimizations.
     */
    htmlType?: "svg" | "html";

    /**
     * Indicates whether multiple instances of this tag are allowed within its parent.
     */
    isRepeated?: boolean;

    /**
     * The tag name, serving as a unique identifier within the Marko ecosystem.
     */
    name?: string;

    /**
     * Describes nested tags within this tag.
     * Each nested tag can have its own attributes and configuration.
     */
    nestedTags?: Record<string, TagDefinition>;

    /**
     * Determines if the tag should only have an opening tag without a matching
     * closing tag.
     */
    openTagOnly?: boolean;

    /**
     * Configuration options that influence how the tag is parsed.
     * This can include directives to preserve whitespace, treat content as raw text,
     * and more.
     */
    parseOptions?: ParseOptions;

    /**
     * Specifies the property name where the content of the nested tag(s) will be stored.
     */
    targetProperty?: string;

    /**
     * Specifies the Typescript type of the tag, aiding in documentation and tooling.
     */
    type?: string;
  };

export type ParseOptions = {
  /**
   * Specifies a module to import when the tag is parsed,
   * which can initialize state or register global behaviors.
   */
  import?: string;

  /** Determines whether whitespace is preserved in the tag's output. Useful for tags where spacing is significant. */
  preserveWhitespace?: boolean;

  /** Allows the tag to be self-closing or to omit its closing tag in the markup. */
  rawOpenTag?: boolean;

  /** Marks the tag as containing a statement, which may influence how its content is evaluated or executed. */
  statement?: boolean;

  /**
   * When true, text nodes within the tag are preserved exactly as written,
   * including whitespace characters.
   */
  text?: boolean;
};

export type CompilerHooks = {
  /**
   * Used to analyze metadata the entire ast before beginning to translate it.
   */
  analyze: string;

  /** @deprecated Use {@link CompilerHooks.translate translate} instead */
  codeGenerator?: string;

  /**
   * Specifies a module for migrating deprecated features within the tag.
   * This can be used to automatically update projects to use newer tag
   * syntax or features.
   */
  migrate?: string;

  // #section Deprecated properties
  /** @deprecated Use {@link CompilerHooks.migrate migrate} instead */
  migrator?: string;

  /** @deprecated Use {@link CompilerHooks.parse parse} instead */
  nodeFactory?: string;

  /**
   * Points to a custom parsing module. This module can modify how the tag is parsed, allowing for custom syntax or behaviors.
   */
  parse?: string;

  /**
   * Defines a module that can transform the tag at compile time.
   * This allows for dynamic modifications to the tag or its children
   * before the final HTML is generated.
   */
  transform?: string;

  /** @deprecated Use {@link CompilerHooks.transform transform} instead */
  transformer?: string;

  /**
   * Specifies a module that translates the tag into another form or representation,
   * often used for cross-compilation or alternative rendering targets.
   */
  translate?: string;
};

export type FileMappings = {
  /**
   * Specifies the path to the JavaScript module that renders this tag.
   * The renderer module exports a function that handles the tag's rendering logic.
   */
  renderer?: string;

  /**
   * Points to the Marko template file associated with this tag. This property specifies the path to the template used for rendering the tag.
   */
  template?: string;

  /**
   * Specifies the file path for custom TypeScript type definitions, enhancing editor
   * support and type checking.
   */
  types?: string;
};

/**
 * Defines the structure of a `marko-tag.json` file
 *
 * The `marko-tag.json` can be used to document the behavior of a tag and it's nested tags.
 * It can also be used to document the tag, and its attributes to aid in tooling autocompletion
 * as well as hooking into the Marko compiler hooks.
 */
export type MarkoTagJsonDefinition = TagDefinition &
  CompilerHooks &
  FileMappings &
  TagDefinitionShortHands;

/**
 * Defines the structure of a `marko.json` file
 *
 * The `marko.json` can be used to identify and document an entire library of tags,
 * including the tags themselves.
 *
 * Tags defined inside the `tags` property or via shorthands have the same structure as {@link MarkoTagJsonDefinition}
 *
 * Note: Compiler hooks, file mappings, and attributes defined here will be applied to all tags.
 */
export type MarkoJsonDefinition = CompilerHooks &
  TagDefinitionShortHands & {
    taglibId: string;

    /**
     * What directory to crawl to autodiscover components. Default:`./components/`
     */
    tagsDir: string;

    /**
     * Creates a _combined_ tag library by referencing others.
     */
    taglibImports: string[];

    /**
     * Defines attributes on all tags.
     */
    attributes: Record<string, AttributeDefinition>;

    /**
     * Maps tag names to their definitions, facilitating the declaration of
     * multiple custom tags within a single library.
     */
    tags?: Record<string, MarkoTagJsonDefinition>;
  };
