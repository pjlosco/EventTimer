package com.pjlosco.eventtimer.participants;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import androidx.core.app.NavUtils;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.pjlosco.eventtimer.DuplicateBibEntryException;
import com.pjlosco.eventtimer.R;
import com.pjlosco.eventtimer.bibs.BibAddEditDialogFragment;

import java.util.UUID;

public class ParticipantFragment extends Fragment {

    private static final String TAG = ParticipantFragment.class.getName();

    public static final String EXTRA_PARTICIPANT_ID = "com.pjlosco.eventtimer.participant_id";

    private static final String DIALOG_BIB = "bib";
    private static final int REQUEST_BIB_NUMBER = 0;

    private Participant participant;
    private EditText firstNameField;
    private EditText lastNameField;
    private EditText ageField;
    private RadioGroup genderRadioGroup;
    private RadioButton genderMaleRadioButton;
    private RadioButton genderFemaleRadioButton;
    private Button bibNumberButton;
    private TextView finishedPlace;
    private TextView finishedTime;

    public static ParticipantFragment newInstance(UUID crimeId) {
        Bundle args = new Bundle();
        args.putSerializable(EXTRA_PARTICIPANT_ID, crimeId);

        ParticipantFragment fragment = new ParticipantFragment();
        fragment.setArguments(args);

        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        UUID participantId = (UUID) getArguments().getSerializable(EXTRA_PARTICIPANT_ID);
        participant = ParticipantCatalogue.get(getActivity()).getParticipant(participantId);
        setHasOptionsMenu(true);
    }

    @TargetApi(11)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_participant, container, false);

        firstNameField = (EditText) view.findViewById(R.id.participant_first_name);
        firstNameField.setText(participant.getFirstName());
        firstNameField.addTextChangedListener(new TextWatcher() {
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i2, int i3) {
                try {
                    String firstnameLowerCase = charSequence.toString().toLowerCase();
                    String firstnameCorrect = Character.toString(firstnameLowerCase.charAt(0)).toUpperCase() + firstnameLowerCase.substring(1);
                    participant.setFirstName(firstnameCorrect);
                } catch (StringIndexOutOfBoundsException e) {

                }
            }
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i2, int i3) {}
            @Override
            public void afterTextChanged(Editable editable) {}
        });

        lastNameField = (EditText) view.findViewById(R.id.participant_last_name);
        lastNameField.setText(participant.getLastName());
        lastNameField.addTextChangedListener(new TextWatcher() {
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i2, int i3) {
                try {
                    String lastnameLowerCase = charSequence.toString().toLowerCase();
                    String lastnameCorrect = Character.toString(lastnameLowerCase.charAt(0)).toUpperCase()+lastnameLowerCase.substring(1);
                    participant.setLastName(lastnameCorrect);
                } catch (StringIndexOutOfBoundsException e) {

                }
            }
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i2, int i3) {}
            @Override
            public void afterTextChanged(Editable editable) {}
        });

        bibNumberButton = (Button)view.findViewById(R.id.bib_number_button);
        bibNumberButton.setText("Bib: " + participant.getBibNumber());
        bibNumberButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                BibAddEditDialogFragment dialog;
                if (participant.getBibNumber() > 0) {
                    dialog = BibAddEditDialogFragment.newInstance(participant.getBibNumber());
                } else {
                    dialog = BibAddEditDialogFragment.newInstance();
                }
                dialog.setTargetFragment(ParticipantFragment.this, REQUEST_BIB_NUMBER);
                dialog.show(getActivity().getFragmentManager(), DIALOG_BIB);
            }
        });

        ageField = (EditText) view.findViewById(R.id.participant_age);
        ageField.setText(participant.getAge()+"");
        ageField.addTextChangedListener(new TextWatcher() {
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i2, int i3) {
                try{
                    participant.setAge(Integer.parseInt(charSequence.toString()));
                } catch (Exception e) {
                    participant.setAge(0);
                }
            }

            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i2, int i3) {
            }

            @Override
            public void afterTextChanged(Editable editable) {
            }
        });

        genderMaleRadioButton = (RadioButton) view.findViewById(R.id.radio_gender_male);
        genderMaleRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                participant.setGender('m');
            }
        });
        genderFemaleRadioButton = (RadioButton) view.findViewById(R.id.radio_gender_female);
        genderFemaleRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                participant.setGender('f');
            }
        });
        if (participant.getGender() == 'm') {
            genderMaleRadioButton.setChecked(true);
        } else if (participant.getGender() == 'f') {
            genderFemaleRadioButton.setChecked(true);
        }

        return view;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode != Activity.RESULT_OK) {return;}
        if (requestCode == REQUEST_BIB_NUMBER) {
            int bibNumber = (Integer)data.getSerializableExtra(BibAddEditDialogFragment.EXTRA_ADD_BIB);
            try {
                ParticipantCatalogue.get(getActivity()).updateParticipantBibNumber(participant, bibNumber);
                bibNumberButton.setText(participant.getBibNumber() + "");
            } catch (DuplicateBibEntryException e) {
                Toast.makeText(this.getActivity(), R.string.duplicate_bib_found, Toast.LENGTH_SHORT).show();
                Log.e(TAG, e.toString());
            }
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                if (NavUtils.getParentActivityName(getActivity()) != null) {
                    // TODO - something is broken with this!!!
                    NavUtils.navigateUpFromSameTask(getActivity());
                }
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        ParticipantCatalogue.get(getActivity()).saveParticipants();
    }
}
