import { Request, Response, NextFunction } from 'express';

interface ValidatorReturnValue {
  isValid: boolean;
  err: any;
}


export const validatePOST = (req: Request, res: Response, next: NextFunction) => {
  let errors = {};
  const { text, incorrect, correct, points, subject } = req.body;

  if (text === undefined){
    errors = Object.assign({}, errors, { text: `Required` });
  } else {
    const { isValid, err } = validateText(text);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (incorrect === undefined) {
    errors = Object.assign({}, errors, { incorrect: `Required` });
  } else {
    const { isValid, err } = validateAnswers(incorrect);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (correct === undefined) {
    errors = Object.assign({}, errors, { correct: `Required` });
  } else {
    const { isValid, err } = validateAnswers(correct);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (points === undefined) {
    errors = Object.assign({}, errors, { points: `Required` });
  } else {
    const { isValid, err } = validatePoints(points);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (subject === undefined) {
    errors = Object.assign({}, errors, { subject: `Required` });
  } else {
    const { isValid, err } = validateSubject(subject);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (Object.keys(errors).length > 0)
    return res.status(400).send(errors);
  return next();
}

export const validatePUT = (req: Request, res: Response, next: NextFunction) => {
  let errors = {};
  const { text, incorrect, correct, points, subject } = req.body;

  if (text !== undefined) {
    const { isValid, err } = validateText(text);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (incorrect !== undefined) {
    const { isValid, err } = validateAnswers(incorrect);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (correct !== undefined) {
    const { isValid, err } = validateAnswers(correct);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (points !== undefined) {
    const { isValid, err } = validatePoints(points);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (subject !== undefined) {
    const { isValid, err } = validateSubject(subject);
    if (!isValid)
      errors = Object.assign({}, errors, err);
  }

  if (Object.keys(errors).length > 0)
    return res.status(400).send(errors);
  return next();
}

const validateText = (text: any): ValidatorReturnValue => {
  let errors = {}

  if (typeof(text) !== 'string')
    errors = Object.assign({}, errors, {
      text: `Must be string`,
    });
  else if (text.length > 150)
    errors = Object.assign({}, errors, {
      text: `Max length: 150`,
    });
  else if (text.length === 0)
    errors = Object.assign({}, errors, {
      text: `Can't be empty`,
    });

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}

const validateAnswers = (answers: any): ValidatorReturnValue => {
  let errors = {};

  if (!Array.isArray(answers))
    errors = Object.assign({}, errors, {
      answers: `Must be array`,
    });
  else if (answers.length === 0)
    errors = Object.assign({}, errors, {
      answers: `At least 1 correct and 1 incorrect answers are required`,
    });
  else {
    for (let i = 0, len = answers.length; i < len; i++) {
      // save the error and break the loop, no need to check all values if one is incorrect
      if (typeof(answers[i]) !== 'string') {
        errors = Object.assign({}, errors, {
          answers: `All answers must be string`,
        });
        break;
      }
        /*else if (answers[i].length === 0) {
        errors = Object.assign({}, errors, {
          answers: `Empty answers aren't allowed`,
        });
        break;
      }*/
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}

const validatePoints = (points: any): ValidatorReturnValue => {
  let errors = {};

  if (typeof(points) !== 'number' && isNaN(Number(points)))
    errors = Object.assign({}, errors, {
      points: `Must be a number`,
    });


  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}

const validateSubject = (subject: any): ValidatorReturnValue => {
  let errors = {};

  if (typeof(subject) !== 'string')
    errors = Object.assign({}, errors, {
      subject: `Must be a string`,
    });
  else if(subject.length === 0)
    errors = Object.assign({}, errors, {
      subject: `Can't be empty`,
    });

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}