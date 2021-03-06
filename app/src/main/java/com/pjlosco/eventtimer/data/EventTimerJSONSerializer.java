package com.pjlosco.eventtimer.data;

import android.content.Context;

import com.pjlosco.eventtimer.participants.Participant;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Patrick on 12/1/2014.
 */
public class EventTimerJSONSerializer {

    private static final String JSON_BIB_ID = "bib_id";
    private static final String JSON_TIMESTAMP = "timestamp";

    private Context mContext;
    private String mFilename;

    public EventTimerJSONSerializer(Context context, String filename) {
        mContext = context;
        mFilename = filename;
    }


    /*** BIBS ***/
    public ArrayList<Integer> loadBibs() throws IOException, JSONException {
        ArrayList<Integer> bibEntries = new ArrayList<Integer>();
        BufferedReader reader = null;
        try {
            InputStream inputStream = mContext.openFileInput(mFilename);
            reader = new BufferedReader(new InputStreamReader(inputStream));
            StringBuilder jsonString = new StringBuilder();
            String line = null;
            while ((line = reader.readLine()) != null) {
                jsonString.append(line);
            }
            JSONArray array = (JSONArray) new JSONTokener(jsonString.toString()).nextValue();
            for (int index = 0; index < array.length(); index++) {
                bibEntries.add(Integer.parseInt(array.getJSONObject(index).getString(JSON_BIB_ID)));
            }
        } catch (FileNotFoundException e) {
            // do nothing and return the empty list
        } finally {
            if (reader != null) {
                reader.close();
            }
        }
        return bibEntries;
    }

    public void saveBibs(ArrayList<Integer> bibs) throws JSONException, IOException {
        JSONArray array = new JSONArray();
        for (int bibIdNumber : bibs) {
            JSONObject json = new JSONObject();
            json.put(JSON_BIB_ID, bibIdNumber);
            array.put(json);
        }
        Writer writer = null;
        try {
            OutputStream outputStream = mContext.openFileOutput(mFilename,Context.MODE_PRIVATE);
            writer = new OutputStreamWriter(outputStream);
            writer.write(array.toString());
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }


    /*** PARTICIPANTS ***/
    public ArrayList<Participant> loadParticipants() throws IOException, JSONException {
        ArrayList<Participant> participants = new ArrayList<Participant>();
        BufferedReader reader = null;
        try {
            InputStream inputStream = mContext.openFileInput(mFilename);
            reader = new BufferedReader(new InputStreamReader(inputStream));
            StringBuilder jsonString = new StringBuilder();
            String line = null;
            while ((line = reader.readLine()) != null) {
                jsonString.append(line);
            }
            JSONArray array = (JSONArray) new JSONTokener(jsonString.toString()).nextValue();
            for (int index = 0; index < array.length(); index++) {
                participants.add(new Participant(array.getJSONObject(index)));
            }
        } catch (FileNotFoundException e) {

        } finally {
            if (reader != null) {
                reader.close();
            }
        }
        return participants;
    }

    public void saveParticipants(ArrayList<Participant> participants) throws IOException, JSONException {
        JSONArray array = new JSONArray();
        for (Participant participant : participants) {
            array.put(participant.toJSON());
        }
        Writer writer = null;
        try {
            OutputStream outputStream = mContext.openFileOutput(mFilename,Context.MODE_PRIVATE);
            writer = new OutputStreamWriter(outputStream);
            writer.write(array.toString());
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }


    /*** TIMESTAMPS ***/
    public ArrayList<Timestamp> loadTimes() throws IOException, JSONException {
        ArrayList<Timestamp> timestamps = new ArrayList<Timestamp>();
        BufferedReader reader = null;
        try {
            InputStream inputStream = mContext.openFileInput(mFilename);
            reader = new BufferedReader(new InputStreamReader(inputStream));
            StringBuilder jsonString = new StringBuilder();
            String line = null;
            while ((line = reader.readLine()) != null) {
                jsonString.append(line);
            }
            JSONArray array = (JSONArray) new JSONTokener(jsonString.toString()).nextValue();
            for (int index = 0; index < array.length(); index++) {
                timestamps.add(Timestamp.valueOf(array.getJSONObject(index).getString(JSON_TIMESTAMP)));
            }
        } catch (FileNotFoundException e) {
            // do nothing and return the empty list
        } finally {
            if (reader != null) {
                reader.close();
            }
        }
        return timestamps;
    }

    public void saveTimes(ArrayList<Timestamp> timestamps) throws JSONException, IOException {
        JSONArray array = new JSONArray();
        for (Timestamp timestamp : timestamps) {
            JSONObject json = new JSONObject();
            json.put(JSON_TIMESTAMP, timestamp);
            array.put(json);
        }
        Writer writer = null;
        try {
            OutputStream outputStream = mContext.openFileOutput(mFilename,Context.MODE_PRIVATE);
            writer = new OutputStreamWriter(outputStream);
            writer.write(array.toString());
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }
}
