import styles from './app.module.css'
import { useEffect, useState } from 'react'

import { WORDS } from './utils/words'
import type { Challenge } from './utils/words'

import { Tip } from './Tip/index'
import { Button } from './components/Button/button'
import { Input } from './components/Inputs'
import { Letter } from './components/Letter'
import { Header } from './components/Header'
import { LettersUsed } from './components/LettersUsed'

import type { LettersUsedProps } from './components/LettersUsed'

const ATTEMPTS_MARGIN = 5

export default function App() {
  const [score, setScore] = useState(0)
  const [letter, setLetter] = useState("")
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([])
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  
  function handleRestartGame() {
    const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar o jogo?")

    if(isConfirmed) {
      startGame()
    }
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length)
    const randomWord = WORDS[index]
    setChallenge(randomWord)

    setScore(0)
    setLetter("")
    setLettersUsed([])
  }

  function handleConfirm() {
    
    if(!challenge) {
      return
    }

    if(!letter.trim()) {
      return alert("Digite uma letra!")
    }

    const value = letter.toUpperCase()
    const exists = lettersUsed.find((used) => used.value.toUpperCase() === value)
 
    if(exists) {
      return alert("Você já ultilizou a letra " + value)
    }

    const hits = challenge
    .word
    .toLocaleUpperCase()
    .split("")
    .filter((char) => char === value).length

    const correct = hits > 0
    const currentScore = score + hits

    setLettersUsed((prevState) => [...prevState, {value, correct}])
    setScore(currentScore)
    setLetter("")
  }

  function endGame(message: string) {
    alert(message)
    startGame()
  }

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if(!challenge) {
      return
    }

    setTimeout(() => {
      if(score === challenge.word.length) {
        return endGame("Parabéns, você descobriu a palavra!")
      }

      const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN

      if(lettersUsed.length === attemptLimit) {
        return endGame("Que pena, você usou todas as tentativas!")
      }
    }, 200)
  }, [score, lettersUsed.length])

  if(!challenge) {
    return
  }

  return (
    <div className={styles.container}>
      <main>
        <Header 
          current={lettersUsed.length} 
          max={challenge.word.length + ATTEMPTS_MARGIN} 
          onRestart={handleRestartGame}
        >
        </Header>
        
        <Tip tip={challenge.tip}></Tip>

        <div className={styles.word}>
          {
            challenge.word.split("").map((letter, index) => {
              const letterUsed = lettersUsed.find((used) => used.value.toLocaleUpperCase() === letter.toLocaleUpperCase())

              console.log(letterUsed)

              return <Letter key={index} value={letterUsed?.value}color={letterUsed?.correct ? "correct" : "default"}></Letter>
            })}
        </div> 

        <h4>Palpite</h4>

        <div className={styles.guess}>
          <Input 
            autoFocus 
            maxLength={1} 
            placeholder='?' 
            value={letter}
            onChange={(e) => setLetter(e.target.value)}>
          </Input>
          
          <Button title='Confirmar' onClick={handleConfirm}></Button>
        </div>

        <LettersUsed data={lettersUsed}></LettersUsed>
      </main>
    </div>
  ) 
}
