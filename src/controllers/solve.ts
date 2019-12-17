import examdb from '../db/exams';
import examController from './exam';

import { Question } from '../models/Question';
import { QuestionSolution } from '../models/QuestionSolution';
import { StudentSolution } from '../models/StudentSolution';

import { possibleGrades } from '../constants';

/**
 * Calculates the points that the student gets based on the answers given.
 *
 * @param {Question[]} examQuestions - The questions that are in the exam.
 * @param {QuestionSolution[]} studentAnswers - The questionSolution objects
 * for each question that the student has answered.
 *
 * @returns {number} - The amount of points aquired for the student.
 */
function calculatePoints(examQuestions: Question[], studentAnswers: QuestionSolution[]): number {
  const points = examQuestions.reduce((acc, question) => {
    const studentAnswer = studentAnswers.find((sa) => sa.questionId === question.id);
    const correctAnswer = question.answers.find((a) => a.correct);

    if (studentAnswer === undefined || studentAnswer === null) return acc;
    if (correctAnswer === undefined || correctAnswer === null) return acc;

    if (studentAnswer.answerId === correctAnswer.id) {
      return acc + question.points;
    }

    return acc;
  }, 0);

  return points;
}

/**
 * Checks the solution provided by the student,
 * calculates the points and assigns a grade for the exam to the student.
 *
 * @param {string} examId - The id of the exam being solved
 * @param {QuestionSolution} studentSolution - The solution provided by the student
 *
 * @returns {number|null} The grade received.
 * If the exam or its boundaries aren't found, null is returned instead
 */
async function submitExam(
  studentSolution: StudentSolution,
): Promise<number|null> {
  const exam = await examController.getExamById(studentSolution.examId);

  if (exam === null) return null;

  const points = calculatePoints(exam.questions, studentSolution.solution);
  const examBoundaries = await examController.getExamBoundaries(studentSolution.examId);

  if (examBoundaries.length === 0) {
    return null;
  }

  // TODO: This needs to be fixed in the future,
  // when you can identify which student is in which specialty
  const boundary = examBoundaries[0];

  let assignedGrade = 0;
  const sortedPossibleGrades = possibleGrades.sort((a, b) => b - a);

  sortedPossibleGrades.some((grade) => {
    if (points < boundary[grade]) return false;

    assignedGrade = grade;
    return true;
  });

  // persist solution and grade
  await Promise.all([
    examdb.saveStudentGrade(studentSolution.examId, studentSolution.studentId, assignedGrade),
    examdb.saveStudentSolution(studentSolution),
  ]);

  return assignedGrade;
}

export default {
  submitExam,
};