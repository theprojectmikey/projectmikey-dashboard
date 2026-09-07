# Getting this onto GitHub

The folder is already a git repo with the first commit made and tagged `v1.0.0`.
You just need to create the empty repo on GitHub and push.

## 1. Create the repo

github.com → **+** (top right) → **New repository**

- Name: `projectmikey-dashboard`
- **Private**
- Do **NOT** tick "Add a README", "Add .gitignore" or "Choose a licence".
  The folder already has all three, and ticking them makes the first push
  conflict.

Click Create. GitHub shows you a page of commands — ignore it, use the ones below.

## 2. Push

Terminal on your Mac, from inside the unzipped folder:

```bash
cd projectmikey-dashboard
git remote add origin https://github.com/YOUR-USERNAME/projectmikey-dashboard.git
git push -u origin main
git push --tags
```

It asks for your GitHub username and password. **The password is not your
GitHub password** — it's a personal access token. github.com → Settings →
Developer settings → Personal access tokens → Tokens (classic) → Generate new,
tick `repo`, copy it, paste it as the password.

Save that token somewhere. You need the same one for HACS.

## 3. Cut a release

HACS prefers tagged releases over the raw branch.

github.com → your repo → **Releases** → **Create a new release** →
choose tag `v1.0.0` → title `v1.0.0` → Publish.

## 4. Install on a box

HACS → three dots → **Custom repositories**

- Repository: `https://github.com/YOUR-USERNAME/projectmikey-dashboard`
- Type: **Dashboard**

Add, then find "ProjectMikey Dashboard" in HACS and Download.

Private repo, so HACS needs that token — it asks for one when you first set HACS
up on a box. Same token, `repo` scope.

## Later, when you change something

```bash
git add -A
git commit -m "what you changed"
git push
git tag v1.1.0 && git push --tags
```

Then cut a release for the new tag. Every box that has the repo added will
show an update in HACS.

Bump the middle number for new features, the last number for fixes. It doesn't
matter much, as long as it goes up.
