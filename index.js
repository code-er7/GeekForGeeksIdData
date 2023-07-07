import puppeteer from "puppeteer";
import fs from 'fs/promises';
import URL from "./url.js";

async function getAllSchoolQuestions(page) {
    const names = await page.evaluate(() => {
        const elements = document.querySelectorAll('#school ul li');
        const a = [];
        elements.forEach(function (element) {
            a.push(element.textContent);
        });
        return a;
    });
    return names;
}

async function getAllEasyQuestions(page) {
    const names = await page.evaluate(() => {
        const elements = document.querySelectorAll('#easy ul li');
        const a = [];
        elements.forEach(function (element) {
            a.push(element.textContent);
        });
        return a;
    });
    return names;
}

async function getAllMediumQuestions(page) {
    const names = await page.evaluate(() => {
        const elements = document.querySelectorAll('#medium ul li');
        const a = [];
        elements.forEach(function (element) {
            a.push(element.textContent);
        });
        return a;
    });
    return names;
}

async function getAllHardQuestions(page) {
    const names = await page.evaluate(() => {
        const elements = document.querySelectorAll('#hard ul li');
        const a = [];
        elements.forEach(function (element) {
            a.push(element.textContent);
        });
        return a;
    });
    return names;
}


async function getData(filePath) {
    try {
        const dataArray = await readDataFromFile(filePath);
        return dataArray;
    } catch (error) {
        console.error('Error:', error);
        return []; // Return an empty array in case of an error
    }
}
async function readDataFromFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const dataArray = data.split('\n').map(item => item.trim());
        return dataArray;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function Compare(old, neww) {

    const newQuestionsSet = new Set(neww);
    const newQuestionsDiff = neww.filter(question => !old.includes(question));
    return newQuestionsDiff;
}
function newData(data, typee, uniqueQuestions) {
    const result = [...uniqueQuestions];
    const currentDateTime = new Date();
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };
    const dateTimeString = currentDateTime.toLocaleString('en-US', options);

    data.forEach(element => {
        result.push({
            type: typee,
            questionName: element,
            time: dateTimeString
        });
    });

    return result;
}
async function writeArrayToJsonFile(dataArray) {
    const filePath = './newData.json';
    const jsonData = JSON.stringify(dataArray, null, 2);

    try {
        await fs.writeFile(filePath, jsonData);
        console.log('JSON file has been written successfully.');
    } catch (error) {
        console.error('Error writing JSON file:', error);
    }
}

async function readDataFromFileJso(filePath) {
    try {
        const jsonData = await fs.readFile(filePath, 'utf8');
        const dataArray = JSON.parse(jsonData);
        return dataArray;
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return [];
    }
}


async function getDataJso(filePath) {
    try {
        const dataArray = await readDataFromFileJso(filePath);
        return dataArray;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function geekScraper() {
    const url = URL;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const schoolQuestions = await getAllSchoolQuestions(page);
    const easyQuestions = await getAllEasyQuestions(page);
    const mediumQuestions = await getAllMediumQuestions(page);
    const hardQuestions = await getAllHardQuestions(page);



    //   const schoolQuestions= ["chetan" , "rao" , "me" ,"Please work", "Armstrong Numbers"];
    const filePath1 = 'school.txt';
    const filePath2 = 'easy.txt';
    const filePath3 = 'medium.txt';
    const filePath4 = 'hard.txt';
    const oldS = await getData(filePath1);
    const oldE = await getData(filePath2);
    const oldM = await getData(filePath3);
    const oldH = await getData(filePath4);
    const newSchoolQuesions = await Compare(oldS, schoolQuestions);
    const newEasyQuestions = await Compare(oldE, easyQuestions);
    const newMediumQuestions = await Compare(oldM, mediumQuestions);
    const newHardQuesions = await Compare(oldH, hardQuestions);
    var uniqueQuestions = [];
    if (newSchoolQuesions.length > 0) {
        uniqueQuestions = newData(newSchoolQuesions, "School", uniqueQuestions);
        const temp = [...oldS, ...newSchoolQuesions];
        await fs.writeFile("school.txt", temp.join("\r\n"));
    }
    if (newEasyQuestions.length > 0) {
        uniqueQuestions = newData(newEasyQuestions, "Easy", uniqueQuestions);
        const temp = [...oldE, ...newEasyQuestions];
        await fs.writeFile("easy.txt", temp.join("\r\n"));
    }
    if (newMediumQuestions.length > 0) {
        uniqueQuestions = newData(newMediumQuestions, "Medium", uniqueQuestions);
        const temp = [...oldM, ...newMediumQuestions];
        await fs.writeFile("medium.txt", temp.join("\r\n"));
    }
    if (newHardQuesions.length > 0) {
        uniqueQuestions = newData(newHardQuesions, "Hard", uniqueQuestions);
        const temp = [...oldH, ...newHardQuesions];
        await fs.writeFile("hard.txt", temp.join("\r\n"));
    }



    const filePathJso = './newData.json';
    const existing = await getDataJso(filePathJso);
    const newArr = [...existing, uniqueQuestions]
    if (uniqueQuestions.length > 0) {
        writeArrayToJsonFile(newArr);
    }
    else {
        console.log("No new Questions");
    }
    await browser.close();
}

geekScraper();
setInterval(geekScraper , 60*60*1000);