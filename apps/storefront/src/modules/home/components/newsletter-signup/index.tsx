"use client"

import { FormEvent, useState } from "react"

import { Button, Heading, Input, Text } from "@modules/common/components/ui"

const NewsletterSignup = () => {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="w-full border-b border-ui-border-base py-12">
      <div className="content-container flex flex-col items-center text-center gap-4">
        <Heading level="h2" className="text-2xl text-ui-fg-base font-normal">
          Join our newsletter
        </Heading>
        {submitted ? (
          <Text className="text-ui-fg-subtle">
            Thank you for subscribing!
          </Text>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-2 small:flex-row"
          >
            <div className="flex-1">
              <Input
                type="email"
                name="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit">Subscribe</Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default NewsletterSignup
