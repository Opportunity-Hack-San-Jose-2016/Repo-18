package repo_18.opportunity_hack_san_jose_2016.github.com.poleactivator;


/**
 * Created by chitoo on 7/10/16.
 */
public class Log {
    public static class AndroidLogger extends Logger {
        private static final int HOST_CLASS_INDEX = 3;

        @Override
        protected void error(String logMsg) {
            android.util.Log.e(Util.getClassNameByStackIndex(HOST_CLASS_INDEX),
                    Util.getString(Util.getHostFunctionName(HOST_CLASS_INDEX),
                            "(): ", logMsg));
        }

        @Override
        protected void debug(String logMsg) {
            android.util.Log.d(Util.getClassNameByStackIndex(HOST_CLASS_INDEX),
                    Util.getString(Util.getHostFunctionName(HOST_CLASS_INDEX),
                            "(): ", logMsg));
        }

        @Override
        protected void info(String logMsg) {
            android.util.Log.i(Util.getClassNameByStackIndex(HOST_CLASS_INDEX),
                    Util.getString(Util.getHostFunctionName(HOST_CLASS_INDEX),
                            "(): ", logMsg));
        }

    }

    public static Logger logImp = new AndroidLogger();

    public static void i(Object... msg) {
        logImp.i(msg);
    }

    public static void d(Object... msg) {
        logImp.d(msg);
    }

    public static void e(Object... msg) {
        logImp.e(msg);
    }
}
