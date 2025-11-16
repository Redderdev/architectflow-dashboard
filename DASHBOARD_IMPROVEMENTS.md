# Dashboard Improvements - Missing Features

**Date:** November 16, 2025  
**Status:** ✅ Phase 1 Complete | ⏳ Phase 2-3 Pending

---

## 🎯 Overview

The MCP Server has 22 fully functional tools, but the Dashboard only visualizes ~50% of the available data. This document outlines missing visualizations and planned improvements.

---

## ❌ Missing Features

### 1. **Blocker Visualization** (Critical)
**Backend Status:** ✅ Fully implemented
- `reportBlocker()` - Create blocker
- `getBlockers()` - Fetch blockers
- `resolveBlocker()` - Resolve blocker

**Frontend Status:** ❌ Not visualized
- No blocker display on feature cards
- No blockers dashboard/section
- No severity indicators
- User cannot see WHY features are blocked

**Implementation Needed:**
- [ ] Add blocker badge to FeatureCard component
- [ ] Create Blockers API route (`/api/blockers`)
- [ ] Create BlockerCard component
- [ ] Add Blockers section to main dashboard
- [ ] Show blocker details (severity, description, age)
- [ ] Visual indicator when feature is blocked

---

### 2. **Dependency Visualization** (High Priority)
**Backend Status:** ✅ Fully implemented
- `getFeatureDependencies()` - Get blockedBy/blocking graph
- `canStartFeature()` - Validate if dependencies met

**Frontend Status:** ⚠️ Minimal (only shows count)
- Feature cards show "3 deps" as text
- No visual dependency graph
- Cannot see which features block which
- No "Blocked By" / "Blocking" lists
- No validation status display

**Implementation Needed:**
- [ ] Enhanced FeatureCard with dependency details
- [ ] Feature Details Modal showing:
  - Blocked By: list of dependencies
  - Blocking: features waiting for this
  - Validation status (ready to start?)
- [ ] Dependency Graph page (`/dependencies`)
  - Interactive node visualization (React Flow / D3.js)
  - Color-coded by status
  - Click to view feature details
- [ ] Dependency API route (`/api/dependencies/:featureId`)

---

### 3. **File Context View** (Medium Priority)
**Backend Status:** ✅ Fully implemented
- `getFileContext()` - Get features by file path
- `logImplementation()` - Links files to features

**Frontend Status:** ❌ Not visualized
- No file-to-feature mapping view
- Cannot browse which files belong to features
- No reverse lookup interface

**Implementation Needed:**
- [ ] Create `/files` page
- [ ] File tree component showing:
  - Directory structure
  - Files with feature associations
  - Multiple features per file support
- [ ] File search functionality
- [ ] Click file → show related features
- [ ] Click feature → show related files
- [ ] Files API route (`/api/files`)

---

### 4. **Enhanced Feature Details** (High Priority)
**Backend Status:** ✅ All data available
- Full feature details with dependencies, tags, files, history

**Frontend Status:** ⚠️ Basic display only
- Feature cards show minimal info
- No detailed view/modal
- Cannot see full description
- No implementation history visible
- Tags truncated (only 3 shown)

**Implementation Needed:**
- [ ] Feature Details Modal component
- [ ] Show on card click (not navigation)
- [ ] Display sections:
  - Full description
  - Status & Priority (editable in future)
  - Dependencies (blockedBy/blocking)
  - Implementation history
  - Files affected
  - All tags
  - Blocker status (if blocked)
- [ ] Close with ESC or overlay click

---

### 5. **Project Filtering** (Quick Fix)
**Backend Status:** ✅ All APIs support project_id
- `/api/features?project_id=X` ✓
- `/api/stats?project_id=X` ✓
- `/api/blockers?project_id=X` ✓

**Frontend Status:** ⚠️ Inconsistent
- Main page: ✅ Has ProjectSelector
- Features page: ❌ No filtering
- Timeline page: ❌ No filtering
- All pages show ALL projects mixed

**Implementation Needed:**
- [ ] Add project filtering to Features page
- [ ] Add project filtering to Timeline page
- [ ] Respect selected project from localStorage
- [ ] Update on projectChanged event
- [ ] Show "All Projects" vs specific project

---

### 6. **Better Tags Display** (Low Priority)
**Backend Status:** ✅ Tags fully supported
- `searchFeatures()` searches in tags
- Tags stored and returned properly

**Frontend Status:** ⚠️ Truncated display
- Only shows first 3 tags
- Rest as "+2" counter
- No tag filtering
- No tag-based search in UI

**Implementation Needed:**
- [ ] Show all tags in Feature Details Modal
- [ ] Add tag filter to Features page
- [ ] Tag cloud/list sidebar
- [ ] Click tag → filter by tag
- [ ] Search features by tag

---

## 📋 Implementation Priority

### **Phase 1: Critical ✅ COMPLETE**
1. ✅ Blocker Visualization (100%)
   - ✅ BlockerCard component with severity badges
   - ✅ BlockersList section on dashboard (grouped by severity)
   - ✅ API route: /api/blockers with project filtering
   - ✅ Blocker badges on FeatureCard (red border when blocked)
   - ✅ Database function: getBlockers(projectId?, includeResolved)

2. ✅ Enhanced Feature Details Modal (100%)
   - ✅ FeatureDetailsModal component
   - ✅ Click any feature card → opens modal
   - ✅ Shows: description, category, status, priority
   - ✅ Shows: active blockers with severity
   - ✅ Shows: dependencies (blockedBy/blocking arrays)
   - ✅ Shows: implementation history
   - ✅ Shows: all tags
   - ✅ Shows: file paths
   - ✅ Shows: timestamps (created/updated)
   - ✅ ESC key + backdrop click to close
   - ✅ API route: /api/features/:id
   - ✅ Database function: getFeatureWithDetails(featureId)

3. ✅ Project Filtering Fix (100%)
   - ✅ Features page: client-side with project filtering
   - ✅ Timeline page: client-side with project filtering
   - ✅ Dashboard: already had ProjectSelector
   - ✅ localStorage integration (selected_project)
   - ✅ Custom event: 'projectChanged' for sync
   - ✅ API route: /api/implementations?project_id=X
   - ✅ Database function: getImplementationHistory(projectId?)

**Phase 1 Status:** All 3 critical features fully implemented and tested
**Build Status:** ✅ 0 errors, production ready
**Server Status:** ✅ Running at localhost:3000

---

### **Phase 2: High Priority ✅ COMPLETE**
4. ✅ Dependency Visualization (100%)
   - ✅ Dependency Graph page (/dependencies) with React Flow
   - ✅ Interactive node visualization with drag/zoom
   - ✅ Color-coded by status (Planning/In Progress/Completed/Blocked)
   - ✅ Border thickness shows priority (Critical → Low)
   - ✅ Animated edges for blocked dependencies
   - ✅ Click node → opens Feature Details Modal
   - ✅ MiniMap for navigation
   - ✅ Project filtering
   - ✅ Legend for status and priority
   - ✅ Navigation link added

5. ✅ Better Tags Display (100%)
   - ✅ Full tags shown in Feature Details Modal
   - ✅ TagFilter component with tag counts
   - ✅ Integrated on Features page
   - ✅ Click tag → filter features
   - ✅ Multiple tag selection (OR logic)
   - ✅ Clear all button
   - ✅ Shows filtered count in header

### **Phase 3: Nice to Have ⏳ PENDING**
6. ⏳ File Context View (0%)
   - ❌ /files page
   - ❌ File tree browser
   - ❌ File-to-feature mapping visualization
   - ❌ Reverse lookup (file → features)
   - ❌ Search functionality
   - ✅ Files already shown in Feature Details Modal (partial)

7. ⏳ Advanced Dependency Features (0%)
   - ❌ canStartFeature() validation display
   - ❌ Visual "ready to start" indicators
   - ❌ Dependency chain visualization

---

## 🎨 Design Mockups

### Enhanced Feature Card
```
┌─────────────────────────────────────┐
│ ⭕ feat-123        [CRITICAL]       │
│                                     │
│ User Authentication                 │
│ NextAuth with Google OAuth...       │
│                                     │
│ 🚫 BLOCKED • High Severity          │
│ "API credentials missing"           │
│                                     │
│ 🔗 Blocks: 3 features               │
│ 📁 4 files • ⏱️ 2h ago              │
│                                     │
│ 🏷️ auth • security • oauth          │
│ [Backend]                           │
└─────────────────────────────────────┘
```

### Blockers Section
```
┌─ Active Blockers ───────────────────┐
│                                      │
│ 🔴 CRITICAL (2)                      │
│ ├─ feat-auth: "OAuth missing..."    │
│ │  Reported 3h ago                   │
│ └─ feat-pay: "Rate limit..."         │
│    Reported 1d ago                   │
│                                      │
│ 🟠 HIGH (1)                          │
│ └─ feat-email: "SMTP error..."       │
│    Reported 5h ago                   │
└──────────────────────────────────────┘
```

### Feature Details Modal
```
┌─ Feature Details ───────────────────┐
│ feat-auth • User Authentication     │
│                                      │
│ STATUS: In Progress                  │
│ PRIORITY: Critical                   │
│                                      │
│ ─── Dependencies ───                 │
│ ✓ Blocked By: (ready to start)      │
│ ⚠️ Blocking: 3 features              │
│   • feat-blog: Blog CRUD             │
│   • feat-admin: Admin Panel          │
│                                      │
│ ─── Files (4) ───                    │
│   • app/api/auth/route.ts            │
│   • lib/auth.ts                      │
│                                      │
│ ─── Implementation History ───       │
│   • 2h ago: Added NextAuth           │
│   • 1h ago: Added middleware         │
│                                      │
│ 🏷️ auth, security, oauth, nextauth  │
└──────────────────────────────────────┘
```

---

## 🚀 Current vs. Target State

### Current State (After Phase 1+2)
```
MCP Server: ████████████████████ 100% (22 tools)
Dashboard:  ██████████████████░░  90% (Phase 1+2 complete)
```

**Implemented:**
- ✅ Blockers: Fully visualized (cards, badges, grouping)
- ✅ Feature Details: Complete modal with all data
- ✅ Project Filtering: Works across all pages
- ✅ Dependencies: Shown in modal + interactive graph page
- ✅ Dependency Graph: Interactive React Flow visualization
- ✅ Files: Shown in modal
- ✅ Tags: Shown in modal + filterable on Features page
- ✅ Tag Filtering: Click-to-filter with counts
- ✅ Implementation History: Shown in modal + timeline page
- ✅ Navigation: 4 pages (Dashboard, Features, Dependencies, Timeline)

**Remaining (Phase 3 - Nice to Have):**
- ⏳ File tree browser page
- ⏳ canStartFeature() validation indicators

### Target State
```
MCP Server: ████████████████████ 100%
Dashboard:  ████████████████████ 100% (all phases complete)
```

**Gap:** Only file tree browser remains as "nice to have" feature

---

## 📊 Impact Analysis

### User Benefits
- ✅ **See Blockers:** Understand why features are stuck
- ✅ **See Dependencies:** Know what blocks what
- ✅ **See Files:** Understand codebase structure
- ✅ **Complete Picture:** Dashboard matches MCP capabilities
- ✅ **Better Decision Making:** Visual insights for planning

### Technical Benefits
- ✅ **Data Consistency:** Frontend shows all backend data
- ✅ **Better Testing:** Can verify MCP tools visually
- ✅ **Documentation:** Dashboard serves as MCP demo
- ✅ **User Trust:** Complete visibility builds confidence

---

## 🛠️ Technical Implementation Notes

### API Routes Status
```
✅ GET /api/blockers?project_id=X&includeResolved=bool  - List blockers
✅ GET /api/features/:id                                - Single feature details
✅ GET /api/implementations?project_id=X                - Implementation history
✅ GET /api/features?project_id=X                       - List features
✅ GET /api/stats?project_id=X                          - Dashboard stats
✅ GET /api/projects                                    - List projects
❌ GET /api/dependencies/:featureId                     - Dependency graph (future)
❌ GET /api/files?project_id=X                          - File mappings (future)
```

### Database Functions Status (lib/db.ts)
```typescript
✅ getBlockers(projectId?: string, includeResolved: boolean)
✅ getFeatureWithDetails(featureId: string)
✅ getImplementationHistory(projectId?: string)
✅ getFeatures(projectId?: string)
✅ getProjects()
✅ getDashboardStats(projectId?: string)
❌ getFeatureDependencies(featureId: string)  // Future: for graph page
❌ getFilesByProject(projectId: string)        // Future: for file browser
```

### Components Status
```
components/
  ✅ BlockerCard.tsx           - Display blocker with severity badges
  ✅ BlockersList.tsx          - List grouped by severity
  ✅ FeatureDetailsModal.tsx   - Full feature modal with all sections
  ✅ FeatureCard.tsx           - Enhanced with blocker badges + onClick
  ✅ DashboardContent.tsx      - Integrated BlockersList
  ✅ ProjectSelector.tsx       - Already existed
  ✅ DependencyGraph.tsx       - React Flow graph visualization (Phase 2)
  ✅ TagFilter.tsx             - Tag filtering UI with counts (Phase 2)
  ✅ Navigation.tsx            - Enhanced with Dependencies link (Phase 2)
  ❌ FileTree.tsx              - File browser (Phase 3 - optional)
```

### State Management
- Use localStorage for selected project
- Use custom events for cross-component communication
- Client-side data fetching with SWR or React Query (optional)

---

## ✅ Success Criteria

### Phase 1 Criteria ✅ COMPLETE
1. ✅ All blocker data is visible to users
2. ✅ Dependency relationships are clear (shown in modal)
3. ✅ File associations are visible (shown in modal)
4. ✅ Project filtering works on all pages
5. ✅ Feature details show complete information
6. ✅ Visual design matches MCP capabilities
7. ✅ No critical data from MCP server is hidden

### Phase 2-3 Criteria ⏳ PENDING
- ⏳ Interactive dependency graph page
- ⏳ File tree browser with reverse lookup
- ⏳ Tag filtering UI
- ⏳ canStartFeature() validation indicators

---

## 📊 Implementation Summary

**Completed (Phase 1+2):**
- 13 new/modified files
- 4 new API routes
- 3 new database functions
- 6 new React components
- 3 enhanced components
- 4 pages total
- 0 build errors
- Server running successfully

**Phase 1 Files:**
```
✅ lib/db.ts                          - 3 new functions
✅ app/api/blockers/route.ts          - NEW
✅ app/api/features/[id]/route.ts     - NEW  
✅ app/api/implementations/route.ts   - NEW
✅ components/BlockerCard.tsx         - NEW
✅ components/BlockersList.tsx        - NEW
✅ components/FeatureDetailsModal.tsx - NEW
✅ components/FeatureCard.tsx         - ENHANCED (onClick, blocker badge)
✅ components/DashboardContent.tsx    - ENHANCED (added BlockersList)
✅ app/features/page.tsx              - CONVERTED (client-side, filtering)
✅ app/timeline/page.tsx              - CONVERTED (client-side, filtering)
```

**Phase 2 Files:**
```
✅ components/DependencyGraph.tsx     - NEW (React Flow integration)
✅ app/dependencies/page.tsx          - NEW (graph visualization page)
✅ components/TagFilter.tsx           - NEW (tag filtering with counts)
✅ components/Navigation.tsx          - ENHANCED (added Dependencies link)
✅ app/features/page.tsx              - ENHANCED (TagFilter integration)
```

**Time Investment:** ~4-5 hours total
**Build Status:** ✅ Production ready (0 errors)
**Live URL:** http://localhost:3000
**New Pages:** /dependencies (interactive graph)

---

**End of Document**
