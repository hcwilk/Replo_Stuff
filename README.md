## Getting Started

1. Create a Supabase Account
2. Add a .env.local file with these variables

```
SUPABASE_URL='...'
SUPABASE_KEY='...'
```

and fill them in with your values

3. Run this query in the SQL Editor in Supabase

```SQL
CREATE TABLE content_blocks (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10),
    content TEXT,
    text_type VARCHAR(10),
    width INT,
    height INT
);
```

4. Run yarn to install all packagesd

5. yarn dev to run!
