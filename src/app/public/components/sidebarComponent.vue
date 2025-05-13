<script>
import { Drawer as PvDrawer } from "primevue";

export default {
  name: "side-bar",
  components: { PvDrawer },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible'],
  data() {
    return {
      userType: 'staff' //  'guest', 'staff' o 'admin'
    }
  },
  computed: {
    sidebar_items() {
      return [
        {
          name: this.$t('sidebar_items.home'),
          path: '/home',
          type: 'both',
          icon: 'pi pi-home',
        },
        {
          name: 'Rooms',
          path: '/rooms',
          type: 'both',
          icon: 'pi pi-building', // Mejor icono para habitaciones
        },

        {
          name: this.$t('sidebar_items.preferences'),
          path: '/profiles/preferences',
          type: 'guest',
          icon: 'pi pi-cog'
        },
        {
          name: this.$t('sidebar_items.book'),
          path: '/crm/book',
          type: 'guest',
          icon: 'pi pi-calendar-plus'
        },
        {
          name: this.$t('sidebar_items.my-bookings'),
          path: '/crm/my-bookings',
          type: 'guest',
          icon: 'pi pi-list'
        },
        {
          name: this.$t('sidebar_items.customer-service'),
          path: '/crm/customer-service',
          type: 'guest',
          icon: 'pi pi-comments'
        },
        {
          name: this.$t('sidebar_items.admin'),
          path: '/billing/admin',
          type: 'admin',
          icon: 'pi pi-shield'
        },
        {
          name: this.$t('sidebar_items.iot-devices'),
          path: '/guest-experience/iot-devices',
          type: 'staff',
          icon: 'pi pi-mobile'
        },
        {
          name: this.$t('sidebar_items.customer-requests'),
          path: '/crm/customer-requests',
          type: 'staff',
          icon: 'pi pi-inbox'
        },
        {
          name: this.$t('sidebar_items.bookings-tracker'),
          path: '/crm/bookings-tracker',
          type: 'staff',
          icon: 'pi pi-chart-line'
        },
        {
          name: this.$t('sidebar_items.request-staff'),
          path: '/crm/request-staff',
          type: 'staff',
          icon: 'pi pi-users'
        },

        {
          name: this.$t('sidebar_items.profile'),
          path: '/profiles/profile',
          type: 'both',
          icon: 'pi pi-user'
        },
      ];
    },
    filteredItems() {
      return this.sidebar_items.filter(item => {
        return item.type === this.userType ||
            item.type === 'both'

      });
    }
  },
  methods: {
    updateVisibility() {
      this.$emit('update:visible', false);
    },
    isActive(path) {
      return this.$route.path === path;
    }
  },
  created() {
    //En teoria aca deberíamos obtener el rol del usuario, en caso se use algun "store" en vue.
  }
}
</script>

<template>
  <PvDrawer
      :visible="visible"
      :dismissable="true"
      @update:visible="updateVisibility"
      style="background: var(--color-secondary-light); color: var(--color-slate); border: none"

  >
    <div class="sidebar-header">
      <h3 class="text-2xl">{{ $t('title') }}</h3>
    </div>

    <div class="sidebar-content">
      <ul class="sidebar-menu">
        <li v-for="item in filteredItems" :key="item.path"
            :class="{ 'active': isActive(item.path) }">
            <router-link :to="item.path">
              <div class="menu-item">
                <i v-if="item.icon" :class="item.icon"></i>
                <span class="menu-label">{{ item.name }}</span>
              </div>
            </router-link>

        </li>
      </ul>
    </div>
  </PvDrawer>
</template>

<style scoped>

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-content {
  padding: 0.5rem 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.sidebar-menu li:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.menu-item {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
}

.sidebar-menu li.active {
  background-color: #272727;
  border-left: 3px solid #fa8f45;
}

.sidebar-menu li.active .menu-item {
  color: #fa8f45;
}

.menu-label {
  margin-left: 0.75rem;
}

i {
  font-size: 1.25rem;
}
</style>