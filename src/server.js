import {
  belongsTo,
  createServer,
  hasMany,
  Model,
  RestSerializer,
  Factory,
} from 'miragejs';
import { faker } from '@faker-js/faker';

export default function (environment = 'development') {
  createServer({
    environment,
    serializers: {
      reminder: RestSerializer.extend({
        include: ['list'],
        embed: true,
      }),
    },
    factories: {
      reminder: Factory.extend({
        text: faker.lorem.sentence(),
      }),
    },
    models: {
      reminder: Model.extend({
        list: belongsTo(),
      }),
      list: Model.extend({
        reminders: hasMany(),
      }),
    },
    seeds(server) {
      server.createList('reminder', 10);

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
