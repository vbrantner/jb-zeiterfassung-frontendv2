<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.route">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dense flat app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Zeiterfassung</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/">Home</router-link>|
      <router-link v-if="$auth.isAuthenticated" to="/profile"
        >Profile</router-link
      >
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    item: 0,
    items: [
      {
        text: "Mitarbeiterverwaltung",
        icon: "mdi-account-multiple",
        route: "mitarbeiterverwaltung",
      },
      { text: "Anwesenheit", icon: "mdi-calendar-clock", route: "anwesenheit" },
      { text: "Stempeluhr", icon: "mdi-progress-clock", route: "stempeluhr" },
    ],
  }),
};
</script>
