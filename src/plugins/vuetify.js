import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

import de from "vuetify/es5/locale/de";

export default new Vuetify({
  lang: {
    locales: { de },
    current: "de"
  }
});
