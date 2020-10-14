<template>
  <div class="timeclock">
    <v-row>
      <v-col>
        <h1 class="text-h4 font-weight-bold">Stempeluhr</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="selectedEmployee" cols="4">
        <v-card>
          <v-card-title>Mitarbeiter</v-card-title>
          <v-card-text>
            <v-card outlined>
              <v-data-table
                :headers="headers"
                :items="Shifts"
                hide-default-footer
                disable-sort
                single-select
                disable-pagination
                @click:row="rowClick"
              ></v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-else cols="6">
        <v-card>
          <v-card-title>Mitarbeiter</v-card-title>
          <v-card-text>
            <v-card outlined>
              <v-data-table
                :headers="headers"
                :items="Shifts"
                hide-default-footer
                disable-sort
                single-select
                disable-pagination
                @click:row="rowClick"
              ></v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="selectedEmployee" cols="8">
        <v-card>
          <v-card-title>{{ selectedEmployee.name }}</v-card-title>
          <!-- Show when Pin successfully wrong or not entered-->
          <template v-if="pinSuccess">
            <v-card-text class="justify-center">
              <h1 class="text-center text-h4 font-weight-normal">
                {{ datenow }}
              </h1>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-spacer></v-spacer>
              <v-btn @click="addShift()" depressed color="primary" large
                >Start<v-icon right>mdi-clock-start</v-icon></v-btn
              >
              <v-spacer></v-spacer>
              <v-btn depressed color="warning" large
                >Ende<v-icon right>mdi-clock-end</v-icon></v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </template>
          <!-- Show when Pin successfully entered -->
          <template v-if="!pinSuccess">
            <v-card-text>
              <h1 class="title">Bitte PIN eingeben</h1>
              <v-form @submit="pinCheck()" @submit.prevent>
                <v-text-field
                  v-model="pinInput"
                  type="number"
                  prepend-icon="mdi-key"
                  label="PIN"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="pinCheck()"
                @keypress.enter="pinCheck()"
                @keydown.enter="pinCheck()"
                color="success"
                >Weiter</v-btn
              >
              <v-btn color="error"
                >Abbrechen
                <v-icon right>mdi-cancel</v-icon>
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar timeout="2000" color="success" v-model="pinSnackbar">
      <div class="justify-center align-center">
        <h3 class="justify-center text-title font-weight-bold">
          Pin erfolgreich
        </h3>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="pinSnackbar = false">
          Close
          <v-icon right>mdi-cancel</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar timeout="2000" color="error" v-model="pinSnackbarWrong">
      <div class="justify-center align-center">
        <h3 class="justify-center text-title font-weight-bold">
          Falscher Pin
        </h3>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="pinSnackbar = false">
          Close
          <v-icon right>mdi-cancel</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import gql from "graphql-tag";
import GetShifts from "../graphql/GetShifts.gql";
// import AddShift from "../graphql/AddShift.gql";
import moment from "moment";
export default {
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.interval = setInterval(this.time, 1000);
  },
  methods: {
    time() {
      this.datenow = moment()
        .locale("de")
        .format("LLLL");
    },
    pinCheck() {
      const pinInput = this.pinInput;
      const userPin = this.selectedEmployee.pin;

      this.pinInput = "";
      if (pinInput == userPin) {
        console.log("success");
        this.pinSnackbar = true;
        this.pinSuccess = true;
      } else {
        this.pinSnackbarWrong = true;
        console.log("Wrong PIN");
      }
    },
    rowClick: function(item, row) {
      row.select(!row.isSelected);
      this.selectedEmployee = row.isSelected == true ? "" : item;
      this.pinSuccess = false;
    },
    generateTableData(resultData) {
      console.log(resultData);
      for (const entry in resultData.Shifts) {
        console.log(resultData.Shifts[entry]);
      }
    },
    addShift() {
      this.formName = "";
      this.formPin = "";
      this.formNewEmployee = false;
      this.$apollo.mutate({
        mutation: gql`
          mutation AddShift($employee_id: Int!, $time_in: timestamptz!) {
            insert_Shift(
              objects: { employee_id_fk: $employee_id, time_in: $time_in }
            ) {
              returning {
                Employee {
                  id
                  name
                  pin
                  Shifts(limit: 1, order_by: { created_at: desc }) {
                    id
                    time_in
                    time_out
                  }
                }
              }
              affected_rows
            }
          }
        `,
        variables: {
          employee_id: this.selectedEmployee.id,
          time_in: new Date().toUTCString(),
        },
        update: (store, { data: { insert_Shift } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: GetShifts,
          });
          console.log(insert_Shift.returning[0]);
          console.log(data);
          // Add our tag from the mutation to the end
          // data.Shifts.Shifts.push(insert_Shift.returning[0]);
          // // Write our data back to the cache.
          // store.writeQuery({ query: insert_Shift, data });
        },
      });
    },
  },
  apollo: {
    // Employees: {
    //   query: Employees_QUERY,
    // },
    Shifts: {
      query: GetShifts,
      // result({ data }) {
      //   this.generateTableData(data);
      // },
    },
  },
  data: () => ({
    headers: [
      {
        text: "Name",
        value: "name",
      },
    ],
    pinInput: "",
    selectedEmployee: "",
    pinSuccess: false,
    pinSnackbar: false,
    pinSnackbarWrong: false,
    datenow: "",
  }),
};
</script>

<style>
.theme--light.v-data-table tbody tr.v-data-table__selected {
  background: #e0e0e0 !important;
  font-weight: 700;
}
.theme--light.v-data-table tbody tr.v-data-table__selected:hover {
  background: #bdbdbd !important;
}
</style>
