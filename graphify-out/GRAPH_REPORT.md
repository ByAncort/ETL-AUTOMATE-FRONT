# Graph Report - .  (2026-06-01)

## Corpus Check
- Corpus is ~27,760 words - fits in a single context window. You may not need a graph.

## Summary
- 72 nodes · 34 edges · 52 communities (4 shown, 48 thin omitted)
- Extraction: 91% EXTRACTED · 6% INFERRED · 3% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.88)
- Token cost: 4,500 input · 3,200 output

## Community Hubs (Navigation)
- [[_COMMUNITY_ETL Pipeline Core|ETL Pipeline Core]]
- [[_COMMUNITY_Application Infrastructure|Application Infrastructure]]
- [[_COMMUNITY_Schema Matching|Schema Matching]]
- [[_COMMUNITY_User Roles|User Roles]]
- [[_COMMUNITY_Globe Texture|Globe Texture]]
- [[_COMMUNITY_API Connection Hooks|API Connection Hooks]]
- [[_COMMUNITY_API Connection Model|API Connection Model]]
- [[_COMMUNITY_Connection Payload|Connection Payload]]
- [[_COMMUNITY_API Connections Hook|API Connections Hook]]
- [[_COMMUNITY_ETL Phase Model|ETL Phase Model]]
- [[_COMMUNITY_ETL Execution Hook|ETL Execution Hook]]
- [[_COMMUNITY_Integration Payload|Integration Payload]]
- [[_COMMUNITY_Integration Model|Integration Model]]
- [[_COMMUNITY_Update Integration|Update Integration]]
- [[_COMMUNITY_Integrations Hook|Integrations Hook]]
- [[_COMMUNITY_LLM Configs Hook|LLM Configs Hook]]
- [[_COMMUNITY_Unified Records Hook|Unified Records Hook]]
- [[_COMMUNITY_User Model|User Model]]
- [[_COMMUNITY_Users Hook|Users Hook]]
- [[_COMMUNITY_Utility Functions|Utility Functions]]
- [[_COMMUNITY_Admin Page|Admin Page]]
- [[_COMMUNITY_Auth Page|Auth Page]]
- [[_COMMUNITY_Run ETL Service|Run ETL Service]]
- [[_COMMUNITY_Run ETL By ID|Run ETL By ID]]
- [[_COMMUNITY_Log Service|Log Service]]
- [[_COMMUNITY_Add Notification|Add Notification]]
- [[_COMMUNITY_Clear Notifications|Clear Notifications]]
- [[_COMMUNITY_Get Notifications|Get Notifications]]
- [[_COMMUNITY_Mark All Read|Mark All Read]]
- [[_COMMUNITY_Mark Read|Mark Read]]
- [[_COMMUNITY_Notification Model|Notification Model]]
- [[_COMMUNITY_Subscribe Notifications|Subscribe Notifications]]
- [[_COMMUNITY_Fetch Schema Matches|Fetch Schema Matches]]
- [[_COMMUNITY_Submit Feedback|Submit Feedback]]
- [[_COMMUNITY_App Entry|App Entry]]
- [[_COMMUNITY_API Field Type|API Field Type]]
- [[_COMMUNITY_ETL Request Type|ETL Request Type]]
- [[_COMMUNITY_ETL Response Type|ETL Response Type]]
- [[_COMMUNITY_Feedback Request|Feedback Request]]
- [[_COMMUNITY_Feedback Response|Feedback Response]]
- [[_COMMUNITY_Integration Type|Integration Type]]
- [[_COMMUNITY_Integration Response|Integration Response]]
- [[_COMMUNITY_Integration Status|Integration Status]]
- [[_COMMUNITY_LLM Config Request|LLM Config Request]]
- [[_COMMUNITY_LLM Config Response|LLM Config Response]]
- [[_COMMUNITY_Log Entry Type|Log Entry Type]]
- [[_COMMUNITY_ML Badge Type|ML Badge Type]]
- [[_COMMUNITY_Schema Field Type|Schema Field Type]]
- [[_COMMUNITY_Schema Match Type|Schema Match Type]]
- [[_COMMUNITY_Match Status Type|Match Status Type]]
- [[_COMMUNITY_Unified Record Type|Unified Record Type]]
- [[_COMMUNITY_GlobeCanvas UI|GlobeCanvas UI]]

## God Nodes (most connected - your core abstractions)
1. `MS-SAVE-DATA ETL Logic` - 9 edges
2. `MS-SAVE-DATA Microservice` - 6 edges
3. `Match Feedback Logic` - 5 edges
4. `SchemaMatch Entity` - 4 edges
5. `Schema Matching Microservice` - 4 edges
6. `Role Controller Documentation` - 3 edges
7. `useEtlExecution Hook` - 3 edges
8. `RoleController API` - 3 edges
9. `UserRoleController API` - 3 edges
10. `React Application` - 3 edges

## Surprising Connections (you probably didn't know these)
- `MS-SAVE-DATA ETL Logic` --references--> `Match Feedback Logic`  [INFERRED]
  docs/SAVE_DATA_ETL_LOGIC.md → docs/MATCH_FEEDBACK_LOGIC.md
- `User Role Controller Documentation` --references--> `API Gateway Backend`  [EXTRACTED]
  docs/user-role-controller.md → README.md
- `Docker Compose Config` --references--> `React Application`  [EXTRACTED]
  docker-compose.yml → README.md
- `index.html Entry Point` --references--> `React Application`  [EXTRACTED]
  index.html → README.md
- `MS-SAVE-DATA ETL Logic` --references--> `Schema Matching Microservice`  [EXTRACTED]
  docs/SAVE_DATA_ETL_LOGIC.md → docs/MATCH_FEEDBACK_LOGIC.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **ETL Execution Flow** — ms_save_data_service, integration_ms_service, api_register_ms_service, schema_matching_ms, schemamatch_entity [INFERRED 0.85]
- **Role-Based Access Control System** — rolecontroller_api, userrolecontroller_api, known_seed_roles, apigateway [INFERRED 0.85]

## Communities (52 total, 48 thin omitted)

### Community 0 - "ETL Pipeline Core"
Cohesion: 0.43
Nodes (8): API Register Microservice, ETL Pipeline (Extract-Transform-Load), EtlExecutionPanel Component, Integration Microservice, MS-SAVE-DATA Microservice, runEtl Service Function, MS-SAVE-DATA ETL Logic, useEtlExecution Hook

### Community 1 - "Application Infrastructure"
Cohesion: 0.33
Nodes (6): API Gateway Backend, Docker Compose Config, index.html Entry Point, React Application, ETL Automate Frontend, User Role Controller Documentation

### Community 2 - "Schema Matching"
Cohesion: 0.60
Nodes (5): Match Feedback Logic, MatchFeedback Entity, MatchReviewCard Component, Schema Matching Microservice, SchemaMatch Entity

### Community 3 - "User Roles"
Cohesion: 0.83
Nodes (4): Known Seed Roles, Role Controller Documentation, RoleController API, UserRoleController API

## Ambiguous Edges - Review These
- `cobe-texture.png` → `Globe Texture Asset`  [AMBIGUOUS]
  src/assets/cobe-texture.png · relation: conceptually_related_to

## Knowledge Gaps
- **51 isolated node(s):** `App`, `GlobeCanvas`, `ApiConnection`, `ApiAuthConfig`, `CreateConnectionPayload` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `cobe-texture.png` and `Globe Texture Asset`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `MS-SAVE-DATA ETL Logic` connect `ETL Pipeline Core` to `Schema Matching`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `User Role Controller Documentation` connect `Application Infrastructure` to `User Roles`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `App`, `GlobeCanvas`, `ApiConnection` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._