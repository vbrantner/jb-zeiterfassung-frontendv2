<template>
  <div>
    <v-row>
      <v-col class="d-flex align-center">
        <h1 class="text-h4 font-weight-bold">Mitarbeiterverwaltung</h1>
        <v-spacer></v-spacer>
        <v-btn color="primary" elevation="2" @click="formNewEmployee = true"
          >Neuer Mitarbeiter</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="formNewEmployee">
      <v-col>
        <v-card>
          <v-card-title>Neuer Mitarbeiter</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="mdi-account"
                v-model="formName"
                label="Name"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-key"
                v-model="formPin"
                label="Pin"
                required
              ></v-text-field>
            </v-form>
            <v-card-actions>
              <v-btn @click="addEmployee()" color="primary" elevation="2"
                >Speichern</v-btn
              >
              <v-btn
                color="error"
                elevation="2"
                @click="formNewEmployee = false"
                >Abbrechen</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Liste aller Mitarbeiter</v-card-title>
          <v-card-text>
            <v-card outlined>
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Pin
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="employee in Employee" :key="employee.name">
                      <td>{{ employee.name }}</td>
                      <td>{{ employee.pin }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import gql from "graphql-tag";
import Employees_QUERY from "../graphql/Employees.gql";
export default {
  created() {
    this.test();
  },
  methods: {
    async idToken() {
      const token = await this.$auth.getIdTokenClaims();
      this.idToken = token;
    },
    addEmployee() {
      const Employee = {
        name: this.formName,
        pin: this.formPin,
      };
      this.formName = "";
      this.formPin = "";
      console.log(Employee.name);
      console.log("test");
      this.formNewEmployee = false;
      this.$apollo.mutate({
        mutation: gql`
          mutation addEmployee($name: String!, $pin: Int!) {
            insert_Employee(objects: { name: $name, pin: $pin }) {
              returning {
                name
                pin
              }
            }
          }
        `,
        variables: {
          name: Employee.name,
          pin: Employee.pin,
        },
        update: (store, { data: { insert_Employee } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: Employees_QUERY,
          });
          console.log(insert_Employee.returning[0]);
          console.log(data);
          // Add our tag from the mutation to the end
          data.Employee.push(insert_Employee.returning[0]);
          // Write our data back to the cache.
          store.writeQuery({ query: Employees_QUERY, data });
        },
      });
    },
  },
  apollo: {
    // Employees: {
    //   query: Employees_QUERY,
    // },
    Employee: {
      query: Employees_QUERY,
      context: {
        headers: {
          Authorization: `Bearer ${this.$auth.getIdTokenClaims()}`,
        },
      },
    },
  },
  data: () => ({
    Employee: "",
    formNewEmployee: false,
    formName: "",
    formPin: "",
    Shifts: "",
  }),
};
</script>
