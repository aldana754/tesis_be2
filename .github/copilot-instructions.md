<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Clean Architecture TypeScript API Project Instructions

This project follows Clean Architecture principles with TypeScript, Express, and TypeORM. When working on this codebase:

## Architecture Guidelines

1. **Domain Layer** (`src/domain/`):
   - Contains pure business logic
   - No external dependencies
   - Entities should be immutable
   - Use interfaces for repositories

2. **Application Layer** (`src/application/`):
   - Orchestrates domain objects
   - Contains application-specific business rules
   - Should not depend on infrastructure details

3. **Infrastructure Layer** (`src/infrastructure/`):
   - Contains framework-specific code
   - Database implementations
   - External service integrations

4. **Presentation Layer** (`src/presentation/`):
   - HTTP controllers and routes
   - Request/response handling
   - Middleware

## Code Style Guidelines

- Use TypeScript strict mode
- Implement dependency injection pattern
- Follow SOLID principles
- Use async/await for asynchronous operations
- Handle errors appropriately with try/catch blocks
- Return appropriate HTTP status codes
- Use meaningful variable and function names

## When adding new features:

1. Start with domain entities and interfaces
2. Implement use cases in the domain layer
3. Create application services if needed
4. Implement infrastructure (repositories, database entities)
5. Add presentation layer (controllers, routes)
6. Update dependency injection in app.ts

## Testing:

- Write unit tests for domain logic
- Use dependency injection for easier testing
- Mock external dependencies
