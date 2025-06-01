import type React from 'react'
import styles from './styles.module.css'

type Props = React.ComponentProps<"input">

export function Input({ ...rest }: Props) {
  return (
    <input type='text' className={styles.input} {...rest}/>
  )
}