# Project Actuals Backend Integration Guide

## Quick Start Setup

### Step 1: Database Setup
Execute this SQL in your database:

```sql
CREATE TABLE pmsmaintables.projectactuals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    missionprojectcode VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    planned NUMERIC(18,2),
    actuals NUMERIC(18,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_project_year (missionprojectcode, year),
    INDEX idx_project (missionprojectcode),
    INDEX idx_year (year)
);

-- Insert sample data
INSERT INTO pmsmaintables.projectactuals (missionprojectcode, year, planned, actuals) VALUES
('2025P007', 2017, 221.70, 152.50),
('2025P007', 2018, 1219.70, 556.30),
('2025P007', 2019, 1702.10, 813.30),
('2025P007', 2020, 1868.30, 740.70),
('2025P007', 2021, 1513.70, 238.20),
('2025P007', 2022, 975.10, 118.40),
('2025P007', 2023, 488.00, 118.00),
('2025P007', 2024, 250.80, 0.00);
```

### Step 2: Add Dependencies
Ensure your `pom.xml` includes (already in project):
```xml
<!-- Spring Boot Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### Step 3: Copy Java Files
Copy these files to your project:

**Entity:**
```
src/main/java/com/pms/entity/ProjectActuals.java
```

**DTOs:**
```
src/main/java/com/pms/dto/ProjectActualsRequest.java
src/main/java/com/pms/dto/ProjectActualsResponse.java
```

**Repository:**
```
src/main/java/com/pms/repository/ProjectActualsRepository.java
```

**Service:**
```
src/main/java/com/pms/service/ProjectActualsService.java
```

**Controller:**
```
src/main/java/com/pms/controller/ProjectActualsController.java
```

### Step 4: Verify Application Config
Ensure `application.properties` or `application.yml` has datasource configured:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/your_database?useSSL=false&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### Step 5: Build and Run
```bash
mvn clean install
mvn spring-boot:run
```

### Step 6: Verify Endpoints
Test with curl or Postman:

```bash
# Get all actuals
curl -X GET http://localhost:7080/api/project-actuals \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific project
curl -X GET http://localhost:7080/api/project-actuals/2025P007 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Backend Code Structure

```
com.pms
├── entity
│   └── ProjectActuals.java              (JPA Entity with BigDecimal)
├── dto
│   ├── ProjectActualsRequest.java       (Request validation)
│   └── ProjectActualsResponse.java      (Response serialization)
├── repository
│   └── ProjectActualsRepository.java    (Data access with queries)
├── service
│   └── ProjectActualsService.java       (Business logic & validation)
└── controller
    └── ProjectActualsController.java    (REST endpoints)
```

---

## Service Methods

### ProjectActualsService

```java
// Get all actuals
List<ProjectActualsResponse> getAllProjectActuals()

// Get by project code
List<ProjectActualsResponse> getProjectActualsByCode(String missionProjectCode)

// Get distinct project codes
List<String> getDistinctProjectCodes()

// Get by year range
List<ProjectActualsResponse> getProjectActualsByYearRange(Integer startYear, Integer endYear)

// Get by ID
ProjectActualsResponse getProjectActualsById(Long id)

// Save (create or update)
ProjectActualsResponse saveProjectActuals(ProjectActualsRequest request)

// Delete by ID
void deleteProjectActuals(Long id)

// Delete all for project code
void deleteByProjectCode(String missionProjectCode)
```

---

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/project-actuals` | Get all actuals |
| GET | `/project-actuals/{missionProjectCode}` | Get by project code |
| GET | `/project-actuals/codes/distinct` | Get distinct project codes |
| GET | `/project-actuals/range?startYear={year}&endYear={year}` | Get by year range |
| POST | `/project-actuals` | Create new record |
| PUT | `/project-actuals/{id}` | Update record |
| DELETE | `/project-actuals/{id}` | Delete record by ID |
| DELETE | `/project-actuals/code/{missionProjectCode}` | Delete all for project |

---

## Frontend Integration (TypeScript)

The frontend service is already updated in `src/services/projectActualsService.ts`:

```typescript
import { projectActualsService } from '../services/projectActualsService';

// Usage in component
const actuals = await projectActualsService.getAllProjectActuals();
const projectActuals = await projectActualsService.getProjectActuals('2025P007');
const formatted = projectActualsService.formatForCashFlow(actuals);
```

---

## Database Relationships

### Current Structure
```
projectactuals (NEW)
├── id (PK, auto-increment)
├── missionprojectcode (FK to projectdetail.missionprojectcode)
├── year
├── planned
├── actuals
├── created_at
└── updated_at
```

### Index Strategy
- Primary Key: `id`
- Unique Constraint: `(missionprojectcode, year)` - prevents duplicates
- Regular Index: `missionprojectcode` - for project filtering
- Regular Index: `year` - for year-based queries

---

## Data Validation

### Request Validation Rules
```
missionProjectCode:
  - Required (not blank)
  - Max 50 characters
  
year:
  - Required
  - Must be between 2000 and 2100
  
planned:
  - Required
  - Must be >= 0.00
  - BigDecimal with 2 decimal places
  
actuals:
  - Required
  - Must be >= 0.00
  - BigDecimal with 2 decimal places
```

### Server-side Validation
All requests go through `validateRequest()` method in service:
- Non-null checks
- String trimming
- Range validation
- Format validation

---

## Error Handling

### Exception Handling Strategy
```
IllegalArgumentException → 400 Bad Request
Resource Not Found → 404 Not Found
Validation Errors → 400 Bad Request with error message
Unknown Errors → 500 Internal Server Error
```

### Logging
- INFO: Successful operations
- WARN: Resource not found
- ERROR: Exceptions with stack trace

---

## Security Considerations

1. **Authentication**: All endpoints require Bearer token
2. **CORS**: Enabled for `http://localhost:5173`
3. **HTTPS**: Use in production
4. **SQL Injection**: Protected by JPA/Hibernate
5. **Input Validation**: Comprehensive validation in DTOs
6. **Access Control**: Implement at security layer if needed

---

## Performance Optimization

1. **Indexes**: Created on `missionprojectcode` and `year`
2. **Unique Constraint**: Prevents duplicate entries
3. **Query Optimization**: Using @Query for efficient lookups
4. **Caching**: Can be added at service layer
5. **Pagination**: Can be added for large datasets

---

## Testing Recommendations

### Unit Tests
```java
@Test
public void testSaveProjectActuals() {
    ProjectActualsRequest request = new ProjectActualsRequest(
        "2025P007", 2025, 
        new BigDecimal("1500.00"), 
        new BigDecimal("1200.50")
    );
    ProjectActualsResponse response = service.saveProjectActuals(request);
    assertNotNull(response.getId());
}

@Test
public void testGetByProjectCode() {
    List<ProjectActualsResponse> actuals = 
        service.getProjectActualsByCode("2025P007");
    assertTrue(!actuals.isEmpty());
}
```

### Integration Tests
```java
@SpringBootTest
public class ProjectActualsIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void testGetAllEndpoint() throws Exception {
        mockMvc.perform(get("/project-actuals"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }
}
```

### API Testing (Postman/cURL)
1. Test GET /project-actuals
2. Test GET /project-actuals/{code}
3. Test POST with valid/invalid data
4. Test error scenarios

---

## Troubleshooting

**Issue**: Table not found
- **Solution**: Run SQL script to create table

**Issue**: Invalid column names
- **Solution**: Check schema name is `pmsmaintables`

**Issue**: 401 Unauthorized
- **Solution**: Verify Bearer token is valid

**Issue**: Duplicate key error
- **Solution**: Use PUT/UPDATE instead of POST for existing project+year combination

**Issue**: BigDecimal precision issues
- **Solution**: Always use String constructor: `new BigDecimal("1500.00")`

---

## Next Steps

1. ✅ Database table created
2. ✅ Java backend implemented
3. ✅ Frontend service created
4. ✅ Cash Flow chart implemented
5. 🔄 Test all endpoints
6. 🔄 Add unit/integration tests
7. 🔄 Performance testing with large datasets
8. 🔄 Add caching if needed
9. 🔄 Deploy to production

---

## Support

For issues or questions:
1. Check logs: `tail -f logs/application.log`
2. Verify database: `SELECT * FROM pmsmaintables.projectactuals`
3. Test endpoints with curl/Postman
4. Review this documentation
