package com.pjlosco.eventtimer.timer;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;

import com.pjlosco.eventtimer.R;

public class TimerActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTitle(R.string.title_activity_timer);
        setContentView(R.layout.activity_timer);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.timer, menu);
        return true;
    }
}
