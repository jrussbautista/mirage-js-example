import { belongsTo, createServer, hasMany, Model } from 'miragejs';

export default function () {
  createServer({
    models: {
      reminder: Model.extend({
        list: belongsTo(),
      }),
      list: Model.extend({
        reminders: hasMany(),
      }),
    },
    seeds(server) {
      server.create('reminder', { text: 'Walk the dog' });
      server.create('reminder', { text: 'Take out the trash' });
      server.create('reminder', { text: 'Work out' });

      const homeList = server.create('list', { name: 'Home' });
      server.create('reminder', { list: homeList, text: 'Do taxes' });

      const workList = server.create('list', { name: 'Work' });
      server.create('reminder', { list: workList, text: 'Visit bank' });
    },
    routes() {
      this.get('/api/reminders', (schema) => {
        return schema.reminders.all();
      });
      this.post('/api/reminders', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.reminders.create(attrs);
      });
      this.delete('/api/reminders/:id', (schema, request) => {
        let id = request.params.id;

        return schema.reminders.find(id).destroy();
      });

      this.get('/api/lists', (schema, request) => {
        return schema.lists.all();
      });

      this.get('/api/lists/:id/reminders', (schema, request) => {
        let listId = request.params.id;
        let list = schema.lists.find(listId);

        return list.reminders;
      });
    },
  });
}
