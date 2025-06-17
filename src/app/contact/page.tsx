'use client'

import { useState } from 'react'

export default function Contact() {
  const [text, setText] = useState("SEND")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setText("...")
    const form = e.currentTarget

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "abd324c7-86b8-4a8c-a75e-e34db2dd2ce6",
          email: (form.elements.namedItem('email') as HTMLInputElement).value,
          name: (form.elements.namedItem('name') as HTMLInputElement).value,
          subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
          message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        }),
      })

      const result = await response.json()
      if (result.success) {
        console.log(result)
        setText("SENT")
      } else {
        console.error("Failed to send message:", result)
      }
    } catch (error) {
      console.error("An error occurred:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" required placeholder="EMAIL" />
        <input type="text" name="name" required placeholder="NAME" />
        <input type="text" name="subject" required placeholder="SUBJECT" />
        <textarea name="message" required rows={3} placeholder="MESSAGE"></textarea>
        <button className="send" type="submit" disabled={isSubmitting || text === "SENT"} style={{filter: text === "SENT" ? 'saturate(0.5)' : ''}}>
          {text}
        </button>
      </form>
    </>
  )
}
