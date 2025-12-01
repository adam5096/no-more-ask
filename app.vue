<template>
  <v-app>
    <NuxtRouteAnnouncer />
    <v-main>
      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6">
            <v-card>
              <v-card-title class="text-h5 text-center pa-4">
                歡迎使用 Vuetify + Nuxt
              </v-card-title>
              <v-card-text class="text-center pa-4">
                <p>Vuetify Nuxt 模組已成功安裝並配置！</p>
                <v-btn color="primary" class="mt-4">
                  開始使用
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
