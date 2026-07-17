# Multiple GitHub Accounts

If you contribute to multiple GitHub Organizations or have a personal account and a work account on the same machine, you've probably hit the "Permission denied" wall. Here's the clean fix using SSH config.

## The setup

Generate two SSH keys:

`ash
ssh-keygen -t ed25519 -C "personal" -f ~/.ssh/personal
ssh-keygen -t ed25519 -C "work" -f ~/.ssh/work
`

Then in ~/.ssh/config:

`
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/personal

Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/work
`

Now you can clone work repos using git@github-work:org/repo.git and personal repos with the normal git@github.com:me/repo.git.
