# Telegram Bot → Daily Logs to GitHub

I wanted a frictionless way to keep a daily log without breaking flow. The answer: a Telegram bot that watches a specific chat and pushes each message as a dated entry into a GitHub repo.

## Why Telegram

I already live in Telegram. Opening a separate journaling app breaks flow; sending a message to a bot doesn't.

## How it works

1. A Python bot (using python-telegram-bot) listens to messages in a private chat.
2. Each message is appended to a markdown file like logs/2026-07-10.md.
3. The bot commits and pushes to a logs repo using GitHub's REST API.

That's it. ~80 lines of Python, running on a tiny VPS, has been running for 3 months without a hiccup.
