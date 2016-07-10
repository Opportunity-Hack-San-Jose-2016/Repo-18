package repo_18.opportunity_hack_san_jose_2016.github.com.poleactivator;

/**
 * Created by chitoo on 7/10/16.
 */
public abstract class Logger {
    protected static final boolean _DEBUG_ = true;

    public void e(Object... msgs) {
        if (_DEBUG_) {
            String logMsg = Util.getString(msgs);
            error(logMsg);
        }
    }

    protected abstract void error(String logMsg);

    protected abstract void debug(String logMsg);

    protected abstract void info(String logMsg);

    public void d(Object... msgs) {
        if (_DEBUG_) {
            String logMsg = Util.getString(msgs);
            debug(logMsg);
        }
    }

    public void i(Object... msgs) {
        if (_DEBUG_) {
            String logMsg = Util.getString(msgs);
            info(logMsg);
        }
    }

}
