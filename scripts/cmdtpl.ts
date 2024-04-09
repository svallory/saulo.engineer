import { exec } from 'child_process';
import { type QuestionCollection, default as inquirer } from 'inquirer';

// The type definition for CommandTemplate
interface CommandTemplate {
  command: string;
  placeholders: string[];
}

// Parse the command-line arguments to extract the template command as a string
const args = process.argv.slice(2);
const templateCommand: string = args.join(' ');

// Extract placeholders from the template command
const extractPlaceholders = (command: string): string[] => {
  const regex = /\{\{(.+?)\}\}/g;
  const placeholders: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(command)) !== null) {
    placeholders.push(match[1]);
  }
  return placeholders;
};

// Replace placeholders in the command with user provided answers
const replacePlaceholders = (command: string, answers: any): string => {
  return command.replace(/\{\{(.+?)\}\}/g, (_, p1) => answers[p1]);
};

// Generate prompts for Inquirer based on the placeholders found in the command
const generatePrompts = (placeholders: string[]): QuestionCollection[] => {
  return placeholders.map((placeholder) => ({
    type: 'input',
    name: placeholder,
    message: `${placeholder}: `,
  }));
};

// The main function to execute the templated command
const runCommand = async () => {
  const placeholders = extractPlaceholders(templateCommand);

  inquirer.prompt(generatePrompts(placeholders)).then((answers) => {
    const finalCommand = replacePlaceholders(templateCommand, answers);
    console.log(`Executing: ${finalCommand}`);

    exec(finalCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error}`);
        return;
      }
      console.log(stdout);
      if (stderr) console.error(stderr);
    });
  });
};

runCommand();
