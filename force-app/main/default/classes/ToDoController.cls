public with sharing class ToDoController {
    @AuraEnabled
    public static string addToDO(String payload){
        ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);

        SObject tsk = (Sobject)Type.forName('ToDo__c').newInstance();
        tsk.put('Name', payloadObject.todoName);
        tsk.put('Done__c', payloadObject.done);

        insert tsk;
        return String.valueOf(tsk.Id);
    }

    @AuraEnabled
    public static void updateToDO(String payload){
        ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);
        SObject tsk = (Sobject)Type.forName('ToDo__c').newInstance();
        tsk.put('Id', payloadObject.todoId);
        tsk.put('Name', payloadObject.todoName);
        tsk.put('Done__c', payloadObject.done);

        update tsk;
    }

    @AuraEnabled
    public static void deleteToDo(String todoId){
        SObject tsk = (Sobject)Type.forName('ToDo__c').newInstance();
        tsk.put('Id',todoId);

        delete tsk;
    }

    @AuraEnabled(cacheable=true)
    public static List<ToDo> getAllTodos(){
        List<SObject> tsks = Database.query(
            'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = LAST_N_DAYS:7 ORDER BY CreatedDate DESC'
        );

        return getToDOs(tsks);
    }

    public static List<ToDo> getToDOs(List<SObject> tsks){
        List<ToDo> todos = new List<ToDo>();
        for (SObject tsk : tsks){
            ToDo todo = new ToDo();
            todo.todoId = tsk.Id;
            todo.todoName = String.valueOf(tsk.get('Name'));
            todo.todoDate = Date.valueOf(tsk.get('CreatedDate'));
            todo.done = Boolean.valueOf(tsk.get('Done__c'));
            todos.add(todo);
        }
        return todos;
    }

    @AuraEnabled
    public static List<ToDo> getCurrentTodos(){
        List<SObject> tsks = Database.query(
            'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = TODAY ORDER BY CreatedDate DESC'
        );

        return getToDOs(tsks);
    }

    class ToDo{
        @AuraEnabled
        public string todoId;
        @AuraEnabled
        public string todoName;
        @AuraEnabled
        public Date todoDate;
        @AuraEnabled
        public Boolean done;
    }
}