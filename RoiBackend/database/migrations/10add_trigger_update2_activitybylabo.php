<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        DB::unprepared('
            CREATE TRIGGER update_activitybylabo_after_delete 
            AFTER DELETE ON activityitemvalues
            FOR EACH ROW
            BEGIN
                UPDATE activitybylabo
                SET is_calculated = FALSE
                WHERE id = OLD.ActivityByLaboId;
            END;
        ');
    }

    public function down()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS update_activitybylabo_after_delete;');
    }
};
