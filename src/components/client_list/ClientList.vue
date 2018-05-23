<template>
  <div>
    <div class="header">
      <p class="title">
        Clients
      </p>
      <b-btn class="rounded add-button" v-on:click="clearData" v-b-modal.modal1>New Client</b-btn>
    </div>
    <table id="clients" striped hover class="main-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Providers</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in allData" :key="item.id">
            <td>{{item.name}}</td>
            <td>{{item.email}}</td>
            <td>{{item.phone}}</td>
            <td>
              <span v-for="(value, index) in item.providers" :key="index">
                {{`${getProviderNameWithId(value)}${(index !== item.providers.length - 1) ? ',' : ''} `}}
              </span>
            </td>
            <td class="red" :key="item.id">
              <a v-on:click="loadEditData(index)" v-b-modal.modal1>Edit</a>
            </td>
            <td class="red" :key="item.id">
              <a v-on:click="onClickDeleteButton(index)">Delete</a>
            </td>
          </tr>
        </tbody>
    </table>

    <!--Modal Component -->
    <b-modal
      id="modal1"
      :title="isAddMode ? 'Add Client' : 'Edit Client'" :visible="isShowModal">
      <div class="row item">
        <label>Name:</label>
        <input class="field right" type="text" v-model="clientInfo.name">
      </div>
      <div class="row item">
        <label>Email:</label>
        <input class="field right" type="text" v-model="clientInfo.email">
      </div>
      <div class="row item">
        <label>Phone:</label>
        <input class="field right" type="text" v-model="clientInfo.phone">
      </div>
      <div class="row item">
        <label>Providers:</label>
        <input class="field provider" type="text" v-model="providerName">
        <button class="add-provider rounded right" v-on:click="onClickAddProvider"> Add Provider </button>
      </div>
      <div class="provider-table">
        <table>
          <tr v-for="(item, index) in allProviders" :key="index">
            <td>
              <input 
                :ref="`check${index}`" 
                type="checkbox" 
                class="check-box"
                :checked="isInClient(item._id)"
              />
            </td>
            <td v-if="isEditing !== index"><p class="editor-provider">{{item.name}}</p></td>
            <td v-if="isEditing == index">
              <input
                class="editor-provider"
                v-focus type="text"
                v-model="allProviders[index].name"
                @keyup.enter="onEndEditingProvider(index)"
                @blur="onEndEditingProvider(index)" 
              />
            </td>
            <td><i class="fa fa-edit" @click="onClickEditProvider(index)"></i></td>
            <td><i v-on:click="onClickDeleteProvider(index)" class="fa fa-trash"></i></td>
          </tr>
        </table>
      </div>
      <hr />
      <button :class="isAddMode ? 'rounded delete-button hide' :'rounded delete-button'" v-on:click="deleteClient">Delete Client</button>
      <button :class="isAddMode ? 'rounded edit-cancel add' : 'rounded edit-cancel'" v-on:click="closeEditModal">Cancel</button>
      <button class="rounded edit-ok" v-on:click="editClient">{{isAddMode ? 'Add ' : 'Edit '}}Client</button>
    </b-modal>

  </div>
</template>

<script>
  import * as _ from 'lodash';
  import Service from '../../apis/service.js';

  const service = new Service();
  const isOpend = false;

  export default {
    data() {
      return {
        name: 'ClientList',
        isAddMode: true,
        isShowModal: false,
        clientInfo: {
          name: '',
          phone: '',
          email: '',
          providers: []
        },
        providerName: '',
        selectedItem: {
          name: '',
          phone: '',
          email: '',
          providers: []
        },
        selectedIndex: 0,
        allData: [],
        allProviders: [],
        isEditing: -1,
      }
    },
    created() {
      service.rest('clients', 'get')
      .then(response => {
        this.allData = response;

        service.rest('providers', 'get')
        .then(response => {
          this.allProviders = response;
          this.updateProviders();
        });
      });
    },
    methods: {
      isInClient: function(providerId) {
        const item = this.selectedItem.providers.find(
          provider => provider === providerId
        );
        return item ? true : false;
      },
      searchProviderNameToAdd: function(name) {
        const item = this.allProviders.find(
          provider => provider.name === name
        );
        return item ? true : false;
      },
      getProviderNameWithId: function(providerId) {
        const currentProvider = this.allProviders.find(
          provider => provider._id === providerId
        );
        return currentProvider ? currentProvider.name : '';
      },
      onClickEditProvider: function(index) {
        this.isEditing = index;
      },
      editClient: function(event) {
        this.updateProviders();
        event.preventDefault();

        if (!this.clientInfo.name) {
          alert ('Please Input the Name');
          return;
        }

        const params = this.clientInfo;
        params.providers = [];
        
        this.allProviders.forEach((item, index) => {
          if (this.$refs[`check${index}`][0].checked) {
            params.providers.push(this.allProviders[index]._id);
          }
        });

        const url = this.isAddMode ? 'client' : 'client/' + this.selectedItem._id;
        const method = this.isAddMode ? 'post' : 'put';

        service.rest(url, method, params)
        .then(response => {
          service.rest('clients', 'get')
          .then(response => {
            this.allData = response;
          });
        });

        this.isShowModal = false;
      },
      closeEditModal: function(event) {
        this.isShowModal = false;
      },
      deleteClient: function(event) {
        if (!confirm("Are you sure delete?")) {
          return;
        }
        service.rest('client/' + this.selectedItem._id, 'delete')
        .then(response => {

          service.rest('clients', 'get')
          .then(response => {
            this.allData = response;
          });
        });
        this.isShowModal = false;
      },
      onClickDeleteButton: function(index) {
        this.selectedItem = this.allData[index];
        this.deleteClient();
      },
      loadEditData: function(index) {
        this.isAddMode = false;
        this.isShowModal = true;
        this.clientInfo.name = this.allData[index].name;
        this.clientInfo.email = this.allData[index].email;
        this.clientInfo.phone = this.allData[index].phone;
        this.clientInfo.providers = [ ...this.allData[index].providers ];

        this.providerName = '';
        this.selectedItem = this.allData[index];
        this.selectedIndex = index;
      },
      clearData: function() {
        this.isShowModal = true;
        this.isAddMode = true;
        this.clientInfo = {
          name: '',
          email: '',
          phone: '',
          providers: []
        };

        this.selectedItem = {
          name: '',
          email: '',
          phone: '',
          providers: []
        };
      },
      onClickDeleteProvider: function(index) {
        if (!confirm('Are you sure delete it?')) {
          return;
        }

        const deletedId = this.allProviders[index]._id;
        service.rest('provider/' + deletedId, 'delete')
        .then(response => {
          service.rest('providers', 'get')
          .then(response => {
            this.allProviders = response;
            this.updateProviders();
          });
        });
        
        this.providerName = '';
      },
      updateProviders: function() {
        this.allData.forEach((client, index) => {

          const diff = _.difference(client.providers, this.allProviders.map(item => item._id));
          this.allData[index].providers = _.difference (client.providers, diff);

          service.rest('client/' + this.allData[index]._id, 'put', this.allData[index])
          .then(response => {

          });
        });
      },
      onClickAddProvider: function() {
        if (this.providerName == '') {
          alert ("Input the Provider Name");
          return;
        }

        if(this.searchProviderNameToAdd(this.providerName)) {
          alert ("This provider exists! Input anoter name.");
          this.providerName = '';
          return;
        }

        const params = {
          name: this.providerName
        }

        service.rest('provider/', 'post', params)
        .then(response => {
          service.rest('providers', 'get')
          .then(response => {
            this.allProviders = response;
          });
        });

        this.providerName = '';
      },
      onEndEditingProvider: function(index) {
        if(this.isEditing === -1) return;
        this.isEditing = -1;

        let searchResult = false;
        this.allProviders.forEach((item, idx) => {
          if (index !== idx && item.name === this.allProviders[index].name) {
            searchResult = true;
          }        
        });

        if (searchResult) {
          service.rest('providers', 'get')
          .then(response => {
            this.allProviders = response;
            alert('It should be different from others.');
            return;
          });
          return;
        }

        service.rest('provider/' + this.allProviders[index]._id, 'put', this.allProviders[index])
        .then(response => {

            service.rest('providers', 'get')
            .then(response => {
              this.allProviders = response;
            });
        });

      }
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus()
        }
      }
    }
  }
</script>

<style lang="scss">
  @import './style.scss';
</style>
