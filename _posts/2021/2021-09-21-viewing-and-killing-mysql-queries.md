---
title: Viewing and killing MySQL queries
---

MySQL running slow and want to see which queries are running? If you can get a
`mysql>` prompt, try `SHOW PROCESSLIST` or `SHOW FULL PROCESSLIST`.

Need to kill one of those queries? Note its `Id` value, and run
`KILL(803952)`.
