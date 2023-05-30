import { input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import figlet from 'figlet';

function displayWelcome(){
    console.log(chalk.green.bold(figlet.textSync('Umbraco', { font: 'Thin'})));
}

async function startPrompts(){

    const answers = {
        firstName: await input(
            { 
                message: "What's your first name?"
            }),
        allowEmail: await confirm(
            { 
                message: "Can we email you?"
            })
    };
      
    console.log(answers.firstName);
    console.log(answers.allowEmail);
};


displayWelcome();
startPrompts();