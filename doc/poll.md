# Poll

[Description](#description)
[Endpoints](#endpoints)
[ToDo](#todo)

## Description

A poll is a way to record the opinion of visitors. Polls consist of a question and a set of answers from which to choose one.

Polls are an extension to ideas where a visitor can choose between serveral options and vote for one ot them.

Because it is likely that Polls will in the future be used in other contexts than just one poll per idea the Poll is setup as an independant entity.
Because it is unlikely that Poll Answers are ever used in another context than the poll itself the Poll Answers are _not_ normalized.

If polls can be added is defined in the `site.config.polls.canAddPolls`.
Minimum role to vote in a poll is defined in the `site.config.polls.requiredUserRole`.

If a poll is open for voting is determined by its `status` field of the Poll.

## Endpoints

Standaard CRUD, via ideas.

Available scopes: `withIdea`, `withVoteCount`, `withUserVote`, `withVotes`.

Additionally the ideas enpoints have a scope `includePoll`.

#### List all Polls
```
GET :HOSTNAME/api/site/:SITE_ID/idea/:IDEA_ID/poll?withVoteCount=1
```

#### Get one Poll
```
GET :HOSTNAME/api/site/:SITE_ID/idea/:IDEA_ID/poll/:POLL_ID
```

#### Update a Poll
```
PUT :HOSTNAME/api/site/:SITE_ID/idea/:IDEA_ID/poll/:POLL_ID
```
								 				
```
{
  "question": "Poll vraag",
  "choices": {
    "1": {
      "title": "Antwoord 1 titel",
      "description": "Antwoord 1 beschrijving"
    },
    "2": {
      "title": "Antwoord 2 titel"
    },
    "3": {
      "description": "Antwoord 3 beschrijving"
    }
  },
  "status": "OPEN"
}
```

#### Create a Poll
```
POST :HOSTNAME/api/site/:SITE_ID/idea/:IDEA_ID/poll
```
								 				
```
{
  "question": "Poll vraag 4",
  "choices": {
    "1": {
      "title": "Antwoord 1 titel",
      "description": "Antwoord 1 beschrijving"
    },
    "2": {
      "title": "Antwoord 2 titel",
      "description": "Antwoord 2 beschrijving"
    }
  }
}
```

#### Delete a Poll
```
DELETE :HOSTNAME/api/site/:SITE_ID/idea/:IDEA_ID/poll/:POLL_ID
```

#### Vote for an Poll
```
POST :HOSTNAME/api/site/:SITE_ID/idea/:IDEA_ID/poll/:POLL_ID/vote
```

```
{
  "choice": 2
}
```

## ToDo

- Validation of choices
- Probably make polls available in a wider context

