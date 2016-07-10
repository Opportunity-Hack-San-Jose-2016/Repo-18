package repo_18.opportunity_hack_san_jose_2016.github.com.poleactivator;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.common.GooglePlayServicesRepairableException;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.location.places.Place;
import com.google.android.gms.location.places.PlaceLikelihoodBuffer;
import com.google.android.gms.location.places.Places;
import com.google.android.gms.location.places.ui.PlacePicker;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class MainActivity extends AppCompatActivity implements GoogleApiClient.OnConnectionFailedListener {
    TextView poleCode;
    TextView location;
    RelativeLayout poleCodeLayout;
    RelativeLayout locationLayout;
    Switch stateSwitch;
    View update;
    final int PLACE_PICKER_REQUEST = 1;
    private GoogleApiClient mGoogleApiClient;
    Place place;
    final String END_POINT = "http://192.168.83.157:3000/api/poles";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        poleCode = (TextView) findViewById(R.id.pole_code);
        location = (TextView) findViewById(R.id.location);
        locationLayout = (RelativeLayout) findViewById(R.id.location_layout);
        locationLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PlacePicker.IntentBuilder builder = new PlacePicker.IntentBuilder();
                try {
                    startActivityForResult(builder.build(MainActivity.this), PLACE_PICKER_REQUEST);
                } catch (GooglePlayServicesRepairableException e) {
                } catch (GooglePlayServicesNotAvailableException e) {
                }
            }
        });

        poleCodeLayout = (RelativeLayout) findViewById(R.id.pole_code_layout);
        poleCodeLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                scan();
            }
        });

        stateSwitch = (Switch) findViewById(R.id.state_btn);
        findViewById(R.id.state_layout).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                stateSwitch.setChecked(!stateSwitch.isChecked());
            }
        });
        update = findViewById(R.id.update_btn);
        update.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                update.setEnabled(false);
                updatePole();
            }
        });
        setUpdateBtn();

        mGoogleApiClient = new GoogleApiClient
                .Builder(this)
                .addApi(Places.GEO_DATA_API)
                .addApi(Places.PLACE_DETECTION_API)
                .enableAutoManage(this, this)
                .build();

        scan();
    }

    public static final MediaType JSON
            = MediaType.parse("application/json; charset=utf-8");

    OkHttpClient client = new OkHttpClient();

    boolean post(String url, String json) throws IOException {
        RequestBody body = RequestBody.create(JSON, json);
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();
        Response response = client.newCall(request).execute();
        Log.i("response = ", response.body().string());
        return response.isSuccessful();
    }

    private class LongOperation extends AsyncTask<PoleForm, Void, Boolean> {

        @Override
        protected Boolean doInBackground(PoleForm... poleForm) {
            boolean res = false;
            try {
                res = post(END_POINT, new ObjectMapper().writeValueAsString(poleForm[0]));
                Log.i("res = ", res);
                return res;
            } catch (IOException e) {
                return false;
            }
        }

        @Override
        protected void onPostExecute(Boolean result) {
            update.setEnabled(true);
            if (result) {
                Toast.makeText(MainActivity.this, "Success", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(MainActivity.this, "Failed, please try again", Toast.LENGTH_LONG).show();
            }
        }

        @Override
        protected void onPreExecute() {
        }

        @Override
        protected void onProgressUpdate(Void... values) {
        }
    }

    private void updatePole() {
        final PoleForm poleForm = new PoleForm();
        poleForm.poleCode = poleCode.getText().toString().trim();
        poleForm.lat = place.getLatLng().latitude;
        poleForm.lng = place.getLatLng().longitude;
        poleForm.address = place.getAddress().toString();
        poleForm.placeName = place.getName().toString();
        poleForm.state = stateSwitch.isChecked();
        new LongOperation().execute(poleForm);
    }

    private void scan() {
        IntentIntegrator integrator = new IntentIntegrator(this);
        integrator.setOrientationLocked(false);
        integrator.initiateScan();
    }

    private void setUpdateBtn() {
        if (poleCode.getText().length() > 0 && place != null) {
            update.setEnabled(true);
        } else {
            update.setEnabled(false);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case PLACE_PICKER_REQUEST:
                if (resultCode == RESULT_OK) {
                    place = PlacePicker.getPlace(data, this);
                    location.setText(place.getName());
                }
                break;

            default:
                IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
                if (result != null) {
                    if (result.getContents() == null) {
                        finish();
                    } else {
                        poleCode.setText(result.getContents());
                    }
                } else {
                    super.onActivityResult(requestCode, resultCode, data);
                }
        }
        setUpdateBtn();
    }

    private void guessCurrentPlace() {
        PendingResult<PlaceLikelihoodBuffer> result = Places.PlaceDetectionApi.getCurrentPlace(mGoogleApiClient, null);
        result.setResultCallback(new ResultCallback<PlaceLikelihoodBuffer>() {
            @Override
            public void onResult(PlaceLikelihoodBuffer likelyPlaces) {

//                PlaceLikelihood placeLikelihood = likelyPlaces.get(0);
//                String content = "";
//                if (placeLikelihood != null && placeLikelihood.getPlace() != null && !TextUtils.isEmpty(placeLikelihood.getPlace().getName()))
//                    content = "Most likely place: " + placeLikelihood.getPlace().getName() + "\n";
//                if (placeLikelihood != null)
//                    content += "Percent change of being there: " + (int) (placeLikelihood.getLikelihood() * 100) + "%";
//                location.setText(content);
//
//                likelyPlaces.release();
            }
        });
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

    }
}
