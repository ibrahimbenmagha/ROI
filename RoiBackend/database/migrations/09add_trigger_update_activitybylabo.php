<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        DB::unprepared('
            CREATE TRIGGER update_activitybylabo AFTER INSERT ON activityitemvalues
            FOR EACH ROW
            BEGIN
                UPDATE activitybylabo
                SET is_calculated = TRUE
                WHERE id = NEW.ActivityByLaboId;
            END;
        ');
    }

    public function down()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS update_activitybylabo;');
    }
};
