import express from 'express'

export type BuildInfo = {
  user: string
  repo: string
  branch: string
  version: string
  success: boolean
}

export interface TypedRequestBody<T> extends express.Request {
  body: T
}

