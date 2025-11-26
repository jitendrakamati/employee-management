export const typeDefs = `#graphql
  type Employee {
    id: ID!
    name: String!
    email: String!
    department: String!
    position: String!
    joinDate: String!
    status: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: Employee!
  }

  type EmployeeConnection {
    employees: [Employee!]!
    total: Int!
    hasMore: Boolean!
  }

  input EmployeeFilter {
    department: String
    position: String
    status: String
    search: String
  }

  input EmployeeSort {
    field: String!
    order: String!
  }

  input CreateEmployeeInput {
    name: String!
    email: String!
    department: String!
    position: String!
    joinDate: String!
    password: String!
    role: String
  }

  input UpdateEmployeeInput {
    name: String
    email: String
    department: String
    position: String
    joinDate: String
    status: String
  }

  type Query {
    # Get all employees with optional filtering and sorting
    employees(
      filter: EmployeeFilter
      sort: EmployeeSort
      limit: Int
      offset: Int
    ): EmployeeConnection!

    # Get single employee by ID
    employee(id: ID!): Employee

    # Get current user
    me: Employee
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): AuthPayload!

    # Employee mutations (admin only)
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    # Flag employee (admin only) - sets status to "flagged"
    flagEmployee(id: ID!): Employee!
    # Unflag employee (admin only) - revert status to "active"
    unflagEmployee(id: ID!): Employee!
  }
`;
