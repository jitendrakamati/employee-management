import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const GET_EMPLOYEES = gql`
  query GetEmployees(
    $filter: EmployeeFilter
    $sort: EmployeeSort
    $limit: Int
    $offset: Int
  ) {
    employees(filter: $filter, sort: $sort, limit: $limit, offset: $offset) {
      employees {
        id
        name
        email
        department
        position
        joinDate
        status
        role
      }
      total
      hasMore
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      name
      email
      department
      position
      joinDate
      status
      role
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      name
      email
      department
      position
      joinDate
      status
      role
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      name
      email
      department
      position
      joinDate
      status
      role
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
    }
  }
`;

export const FLAG_EMPLOYEE = gql`
  mutation FlagEmployee($id: ID!) {
    flagEmployee(id: $id) {
      id
      status
    }
  }
`;

export const UNFLAG_EMPLOYEE = gql`
  mutation UnflagEmployee($id: ID!) {
    unflagEmployee(id: $id) {
      id
      status
    }
  }
`;
