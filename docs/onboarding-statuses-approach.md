# Onboarding Statuses Approach

## Overview

The onboarding statuses system provides a comprehensive framework for tracking user progress through various phases of the application. This approach ensures users complete necessary steps while maintaining flexibility for different user roles and workflows.

## Core Structure

### Type Definition

The system uses a TypeScript type `OnboardingStatus` that defines 50+ boolean flags covering:

- **Core verification** (email, phone, profile)
- **Security & compliance** (2FA, terms, privacy)
- **Payment & billing** (Stripe, plans, payment methods)
- **User engagement** (login, tutorial, welcome)
- **Collaboration** (teams, invitations)
- **Product adoption** (features, data, integrations)
- **Communication preferences**
- **Advanced features** (API keys, webhooks, domains)
- **Task marketplace workflows** (Viber and Coder specific)
- **Dispute resolution**
- **Reputation system**

### Default State

All statuses default to `false`, ensuring users start with a clean slate and must explicitly complete each step.

## Phased Approach

The system organizes onboarding into logical phases:

### Core Phases

- **verification**: Basic account setup
- **security**: Security and legal compliance
- **billing**: Payment and subscription setup
- **engagement**: Initial user experience
- **collaboration**: Team and invitation features
- **adoption**: Feature usage and integrations
- **communication**: Notification preferences
- **advanced**: Advanced feature setup

### Task Marketplace Phases

- **task_posting**: Viber-specific task creation
- **task_claiming**: Coder-specific task discovery
- **task_management_viber**: Viber task oversight
- **task_delivery_coder**: Coder task completion
- **dispute_resolution**: Conflict handling
- **reputation_system**: Reviews and ratings

## Helper Functions

### Phase Completion

```typescript
isPhaseComplete(status: OnboardingStatus, phase: keyof typeof onboardingPhases): boolean
```

Checks if all steps in a specific phase are completed.

### Progress Tracking

```typescript
getCompletionPercentage(status: OnboardingStatus): number
```

Returns overall completion percentage (0-100).

### Next Steps

```typescript
getNextIncompleteStep(status: OnboardingStatus): keyof OnboardingStatus | null
```

Identifies the next incomplete step in the overall flow.

### Role-Specific Tracking

```typescript
getRoleCompletionPercentage(status: OnboardingStatus, role: "viber" | "coder"): number
getNextRoleStep(status: OnboardingStatus, role: "viber" | "coder"): keyof OnboardingStatus | null
```

Provides role-specific progress tracking for Viber and Coder workflows.

## Key Benefits

### 1. Comprehensive Coverage

- Tracks 50+ different onboarding steps
- Covers both general and role-specific workflows
- Ensures no critical steps are missed

### 2. Flexibility

- Modular phase-based organization
- Role-specific progress tracking
- Easy to extend with new statuses

### 3. User Experience

- Clear progress indicators
- Guided onboarding flow
- Prevents overwhelming users with all steps at once

### 4. Maintainability

- Type-safe implementation
- Centralized configuration
- Easy to modify and extend

### 5. Analytics Ready

- Granular tracking of user behavior
- Completion metrics for different phases
- Role-specific analytics

## Implementation Considerations

### Database Storage

- Store as JSONB in user profile
- Efficient querying and updates
- Atomic updates for individual statuses

### UI Integration

- Progress bars for overall completion
- Phase-specific progress indicators
- Role-specific dashboards

### Performance

- Lazy loading of phase-specific data
- Cached completion calculations
- Efficient status updates

## Future Enhancements

### Conditional Dependencies

- Some steps may depend on others
- Dynamic phase ordering
- Context-aware next steps

### A/B Testing

- Different onboarding flows
- Step ordering variations
- Completion rate optimization

### Analytics Integration

- Drop-off point identification
- Step completion time tracking
- User behavior patterns

## Usage Examples

```typescript
// Check if user has completed verification phase
const isVerified = isPhaseComplete(userStatus, "verification");

// Get overall progress
const progress = getCompletionPercentage(userStatus);

// Get next step for a Viber user
const nextStep = getNextRoleStep(userStatus, "viber");

// Check role-specific completion
const coderProgress = getRoleCompletionPercentage(userStatus, "coder");
```

This approach provides a robust foundation for user onboarding while maintaining flexibility for different user types and workflows.
