<template>
  <div class="row">
    <div class="col">
      <h3>Welcome,</h3>
      <div class="alert alert-info">
        {{ userInfo }}
      </div>
      <router-link to="/logout"> Logout </router-link>
    </div>
  </div>
</template>
<script>
import UserInfoStore from "../app/user-info-store";
import getCredentials from "../getCred.js";

export default {
  name: "Home",
  data: function () {
    return {
      userInfo: UserInfoStore.state.cognitoInfo,
    };
  },
  created: function () {
    getCredentials.getCredentials().then(function (credentials) {
      console.log("credentials from created: ", credentials);
    });
  },
};
</script>
<style></style>
