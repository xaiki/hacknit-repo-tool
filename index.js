const fetch = require('node-fetch');
const process = require('process');

const token = process.env.HACKNIT_GITHUB_KEY
const REPO = process.env.HACKNIT_REPO || 'seplagniteroi/hacknit'

const conf = {
    json: true,
    headers: {
        'accept': 'application/vnd.github.v3+json',
        'authorization': `token ${token}`
    }
}

const gh = {
    get: (url) => (
        fetch(`https://api.github.com/${url}`, conf)
            .then(res => res.json())
    ),
    put: (url) => (
        fetch(`https://api.github.com/${url}`, {...conf, method: 'PUT'})
            .then(res => res.json())
    ),
    post: (url, params) => (
        fetch(`https://api.github.com/${url}`, {
            ...conf,
            method: 'POST', body: JSON.stringify(params)})
            .then(res => res.json())
    ),
    patch: (url, params) => (
        fetch(`https://api.github.com/${url}`, {
            ...conf,
            method: 'PATCH', body: JSON.stringify(params)})
            .then(res => res.json())
    )
}

const debug = (arg) => {
    console.error(arg)
    return arg
}

const run = async () => {
    const processed = 0
    const master = await gh.get(`repos/${REPO}/branches/master`)
    const head = master.commit.sha
    const pulls = await gh.get(`repos/${REPO}/pulls`)
    pulls.map(async pull => {
        processed++
        try {
            const team = pull.title.match(/\d+/)[0]
            console.error('team:', team)
            const ref = await gh.post(`repos/${REPO}/git/refs`, {
                ref: `refs/heads/${team}`,
                sha: head
            })

            const ren = await gh.patch(`repos/${REPO}/pulls/${pull.number}`, {base: team})
            await gh.put(`repos/${REPO}/pulls/${pull.number}/merge`)
        } catch(e) {
            console.error(`couldn't parse PR #${pull.number}`, pull.title)
        }
    })
    console.log(`proccessed: ${proccessed} repos`)
}

run()
