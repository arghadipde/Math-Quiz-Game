"use client"

class QuestionGenerator {
  static generateQuestion(level: number) {
    const types = ["arithmetic", "missing", "comparison", "logic", "truefalse"]
    const type = types[Math.floor(Math.random() * types.length)]

    switch (type) {
      case "arithmetic":
        return this.generateArithmetic(level)
      case "missing":
        return this.generateMissing(level)
      case "comparison":
        return this.generateComparison(level)
      case "logic":
        return this.generateLogic(level)
      case "truefalse":
        return this.generateTrueFalse(level)
      default:
        return this.generateArithmetic(level)
    }
  }

  static generateArithmetic(level: number) {
    const operations = ["+", "-", "×", "÷"]
    const maxNum = Math.min(10 + Math.floor(level / 5), 100)

    let a = Math.floor(Math.random() * maxNum) + 1
    let b = Math.floor(Math.random() * maxNum) + 1
    const op = operations[Math.floor(Math.random() * operations.length)]

    let question: string
    let answer: number

    switch (op) {
      case "+":
        answer = a + b
        question = `${a} + ${b} = ?`
        break
      case "-":
        if (a < b) [a, b] = [b, a] // Ensure positive result
        answer = a - b
        question = `${a} - ${b} = ?`
        break
      case "×":
        a = Math.floor(Math.random() * 12) + 1
        b = Math.floor(Math.random() * 12) + 1
        answer = a * b
        question = `${a} × ${b} = ?`
        break
      case "÷":
        answer = Math.floor(Math.random() * 12) + 1
        a = answer * (Math.floor(Math.random() * 12) + 1)
        question = `${a} ÷ ${answer} = ?`
        break
      default:
        answer = a + b
        question = `${a} + ${b} = ?`
    }

    return { type: "arithmetic", question, answer }
  }

  static generateMissing(level: number) {
    const maxNum = Math.min(10 + Math.floor(level / 5), 50)
    const a = Math.floor(Math.random() * maxNum) + 1
    const b = Math.floor(Math.random() * maxNum) + 1
    const operations = ["+", "-"]
    const op = operations[Math.floor(Math.random() * operations.length)]

    let question: string
    let answer: number

    if (op === "+") {
      const result = a + b
      if (Math.random() < 0.5) {
        question = `? + ${b} = ${result}`
        answer = a
      } else {
        question = `${a} + ? = ${result}`
        answer = b
      }
    } else {
      const result = Math.max(a, b) - Math.min(a, b)
      const larger = Math.max(a, b)
      const smaller = Math.min(a, b)

      if (Math.random() < 0.5) {
        question = `? - ${smaller} = ${result}`
        answer = larger
      } else {
        question = `${larger} - ? = ${result}`
        answer = smaller
      }
    }

    return { type: "missing", question, answer }
  }

  static generateComparison(level: number) {
    const maxNum = Math.min(20 + Math.floor(level / 3), 100)
    const a = Math.floor(Math.random() * maxNum) + 1
    const b = Math.floor(Math.random() * maxNum) + 1

    const question = `${a} vs ${b}`
    const answer = a > b ? a.toString() : b.toString()
    const options = [a.toString(), b.toString()]

    return { type: "comparison", question, answer, options }
  }

  static generateLogic(level: number) {
    const patterns = [
      // Arithmetic sequence
      () => {
        const start = Math.floor(Math.random() * 10) + 1
        const diff = Math.floor(Math.random() * 5) + 1
        const sequence = [start, start + diff, start + 2 * diff, start + 3 * diff]
        const answer = start + 4 * diff
        return {
          question: `${sequence.join(", ")}, ?`,
          answer,
        }
      },
      // Multiplication sequence
      () => {
        const start = Math.floor(Math.random() * 5) + 2
        const mult = 2
        const sequence = [start, start * mult, start * mult * mult]
        const answer = start * mult * mult * mult
        return {
          question: `${sequence.join(", ")}, ?`,
          answer,
        }
      },
    ]

    const pattern = patterns[Math.floor(Math.random() * patterns.length)]()
    return { type: "logic", question: pattern.question, answer: pattern.answer }
  }

  static generateTrueFalse(level: number) {
    const statements = [
      () => {
        const a = Math.floor(Math.random() * 20) + 1
        const b = Math.floor(Math.random() * 20) + 1
        const isTrue = Math.random() < 0.5
        const result = isTrue ? a + b : a + b + Math.floor(Math.random() * 5) + 1
        return {
          question: `${a} + ${b} = ${result}`,
          answer: isTrue ? "True" : "False",
        }
      },
      () => {
        const a = Math.floor(Math.random() * 10) + 5
        const b = Math.floor(Math.random() * 5) + 1
        const isTrue = Math.random() < 0.5
        const comparison = isTrue ? a > b : a < b
        return {
          question: `${a} ${comparison ? ">" : "<"} ${b}`,
          answer: comparison ? "True" : "False",
        }
      },
    ]

    const statement = statements[Math.floor(Math.random() * statements.length)]()
    return {
      type: "truefalse",
      question: statement.question,
      answer: statement.answer,
      options: ["True", "False"],
    }
  }
}

export default QuestionGenerator
